import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request : Request) {
    try {
        const { email, password } = await request.json();

        if(!email || !password) {
            return NextResponse.json({
                message: "El correo y la contraseña son obligatorios",
                status: 400
            })
        }

        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return NextResponse.json({
                message: error.message,
                status: 400
            })
        }

        return NextResponse.json({
            message: "Inicio de sesión correcto",
            user: data.user,
            status: 200
        })

    } catch (err) {
        console.log(err);

        return NextResponse.json({
            err
        });
    }
}