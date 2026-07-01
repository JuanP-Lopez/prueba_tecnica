"use client"

import { createBrowserClient } from "@supabase/ssr";

import { useState, useEffect } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [ userInfo, setUser ] = useState<string | null>(null);
 
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  }

  useEffect(() => {
    async function getUser() {
      const { data: {user}, error } = await supabase.auth.getUser();

      if (user) {
        // 2. Guardamos directamente el string del nombre guardado en metadata
        setUser(user.user_metadata?.nombre_completo || "Usuario");
      } else {
        setUser("Usuario");
      }
    }

    getUser();

  }, []);

  console.log(userInfo);


  return (
    <div className=" flex flex-col justify-center items-center bg-background text-foreground min-h-screen m-2 gap-2">
      {/* <ModeToggle /> */}

      <Card className="w-full p-4 items-center">
        <CardDescription className="text-black-800">
          Welcome {userInfo}! To logout <span onClick={handleLogout} className="text-blue-700 underline">click here</span>
        </CardDescription>
      </Card>

    </div>
  )
}