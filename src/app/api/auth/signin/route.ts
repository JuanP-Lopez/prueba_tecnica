import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({
                message: "El correo y la contraseña son obligatorios",
                status: 400
            })
        }

        const supabase = await createClient();

        const { data: attempts, error: errorAttemps } = await supabase
            .from("intentos_signin").select("conteo_intentos, tiempo_bloqueo").eq("correo", email).maybeSingle();

        if (attempts && attempts.tiempo_bloqueo) {
            const now = new Date();

            const tiempoBloqueo = new Date(attempts.tiempo_bloqueo);

            if (now.getTime() < tiempoBloqueo.getTime()) {
                const tiempoRestante = Math.ceil((tiempoBloqueo.getTime() - now.getTime()) / 60000)

                return NextResponse.json({
                    error: {
                    message: `Cuenta bloqueada temporalmente. Demasiados intentos de inicio de sesión fallidos. Intente de nuevo en ${tiempoRestante} minutos.`
                    },
                    status: 403
                })
            }
        }

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {

            let totalAttempts = (attempts?.conteo_intentos || 0) + 1;
            let desbloqueo: string | null = null;
            let mensajeError = "";
            const tiempoParaDesbloqueo = new Date();

            if (totalAttempts >= 8) {
                tiempoParaDesbloqueo.setMinutes(tiempoParaDesbloqueo.getMinutes() + 1440);
                desbloqueo = tiempoParaDesbloqueo.toISOString();
                mensajeError = "Has tenido 8 inicios de sesión fallidos. Tu cuenta ha sido bloqueada por 1440 minutos.";
            } else if (totalAttempts >= 5) {
                tiempoParaDesbloqueo.setMinutes(tiempoParaDesbloqueo.getMinutes() + 60);
                desbloqueo = tiempoParaDesbloqueo.toISOString();
                mensajeError = "Has tenido 5 inicios de sesión fallidos. Tu cuenta ha sido bloqueada por 60 minutos.";
            } else if (totalAttempts >= 3) {
                tiempoParaDesbloqueo.setMinutes(tiempoParaDesbloqueo.getMinutes() + 15);
                desbloqueo = tiempoParaDesbloqueo.toISOString();
                mensajeError = "Has tenido 3 inicios de sesión fallidos. Tu cuenta ha sido bloqueada por 15 minutos.";
            } 

            const { data, error } = await supabase.from("intentos_signin").upsert({
                correo: email,
                conteo_intentos: totalAttempts,
                tiempo_bloqueo: desbloqueo
            }, { onConflict: 'correo' });


            return NextResponse.json({
                error: {
                    message: mensajeError,
                    authError
                },
                status: 400
            })
        }

        if (attempts) {
            await supabase.from("intentos_signin").update({ conteo_intentos: 0, tiempo_bloqueo: null }).eq("correo", email);
        }

        const session_id = crypto.randomUUID();
        const user_id = data.user?.id;

        const { data: session, error } = await supabase.from("manejo_sessions").upsert({
            user_id: user_id,
            session_id: session_id,
            ultima_actividad: new Date().toISOString()
        }, { onConflict: 'user_id'} );

        const response = NextResponse.json({
            message: "Inicio de sesión correcto",
            user: data.user,
            status: 200
        })

        response.cookies.set("current_session", session_id, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        return response;

    } catch (err) {
        console.log(err);

        return NextResponse.json({
            err
        });
    }
}