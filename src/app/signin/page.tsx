"use client"

import Link from "next/link";

import { SuccessDialog } from "@/components/ui/success-dialog/alert-dialog";
import { AlertDialog } from "@/components/ui/alert-dialog/alert-dialog";
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

interface CustomError {
  message: string;
  status: number | string;
}

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<CustomError | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const request = { email, password };

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });

      const result = await res.json();
      console.log("Respuesta del servidor: ", result);

      if (result.status === 400) {
        setError(result);
      } else if (result.status === 200) {
        setSuccess(result.message)
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("Error en registro: ", error);
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
            <Link href="/">O registrate aquí</Link>
          </CardAction>
        </CardHeader>
        <CardContent>

          <form onSubmit={handleSubmit}>

            <InputRequired
              id="Correo"
              label="Correo electrónico"
              placeholderText="Ingresa tu correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

      <div className="justify-center">
        {success && (
          <SuccessDialog message={success} />
        )}

        {error && (
          <AlertDialog message={error.message} code={error.status} />
        )}

      </div>

    </div>
  );
}
