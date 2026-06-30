"use client"

import Link from "next/link";

import { InputRequired } from "@/components/ui/input-required/input-required";
import { ButtonLogin } from "@/components/ui/button-login/button-login";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const res = await fetch("https://quickpassapi-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          correo,
          password
        })
      });

      console.log(res);

      const result = await res.json();

      // login(result);

      if (res.status == 200) {
        router.push("/dashboard");
      }

    } catch (error) {
      console.log("Error al iniciar sesión: ", error);
    }
  };

  return (
    <div className=" flex flex-col justify-center items-center bg-background text-foreground min-h-screen m-2 gap-2">
      {/* <ModeToggle /> */}

      <Card className="w-full p-4">
        <CardHeader>
          <CardTitle>Inicia sesión</CardTitle>
          <CardDescription>
            Ingresa tus datos para iniciar sesión.
          </CardDescription>
          <CardAction>
            <Link href="/signin">O registrate aquí</Link>
          </CardAction>
        </CardHeader>
        <CardContent>

          <form onSubmit={handleSubmit}>

            <InputRequired
              id="Correo"
              label="Correo electrónico"
              placeholderText="Ingresa tu correo electrónico"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <InputRequired
              id="Password"
              label="Contraseña"
              placeholderText="Ingresa tu contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <ButtonLogin placeholderText="Clic para iniciar sesión" />

          </form>

        </CardContent>
      </Card>
    </div>
  );
}
