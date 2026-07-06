"use client"

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function TrackingProvider({ children } : { children: React.ReactNode }) {
    const router = useRouter();
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const PERIODO_INACTIVIDAD = 15 * 60 * 1000;

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const resetTimeOut = () => {
        document.cookie = `lastAction=${Date.now()}; path=/; max-age=86400; SameSite=Lax`;
        
        if (timerRef.current) clearTimeout(timerRef.current); 

        timerRef.current = setTimeout(async () => {
            await supabase.auth.signOut();
            document.cookie = "lastAction=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            router.push("/");
            router.refresh();
        }, PERIODO_INACTIVIDAD);
    };

    useEffect(() => {
        const actions = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
        actions.forEach((action) => window.addEventListener(action, resetTimeOut));
        resetTimeOut();

        return () => {
            actions.forEach((action) => window.removeEventListener(action, resetTimeOut));
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return <>{children}</>
}