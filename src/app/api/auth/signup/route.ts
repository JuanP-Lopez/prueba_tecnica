import { createClient } from "@/lib/supabase/server";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        console.log("Datos recibidos: ", request);
        const { nombre, email, password } = await request.json();
        console.log("Datos formateados: ", { nombre, email, password });

        const passwordCheck = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!email || email.length > 254 || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json(
                { message: 'Formato incorrecto o email demasiado largo' },
                { status: 400 })
        }

        if (!nombre || nombre.trim().length < 5) {
            return NextResponse.json(
                { message: 'El nombre debe tener al menos 5 caracterés' },
                { status: 400 })
        }

        if (!password || !passwordCheck.test(password)) {
            return NextResponse.json(
                { message: 'La contraseña debe tener al menos una letra y un número y ser de al menos 8 caracterés' },
                { status: 400 })
        }

        const supabase = await createClient();

        const { data, error: errorAuth } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre_completo: nombre
                }
            }
        });

        console.dir(errorAuth, { depth: null });
        console.dir(data, { depth: null });

        if (errorAuth) {
            return NextResponse.json(
                {errorAuth},
                {status: 400})
        }

        return NextResponse.json(
            { 
                message: 'Usuario registrado con exito',
                status: 200
            })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || 'Error interno' },
            { status: 500 })
    }
}