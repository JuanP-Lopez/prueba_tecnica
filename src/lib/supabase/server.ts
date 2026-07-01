import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    console.log("URL DE SUPABASE:", process.env.SUPABASE_URL);
    console.log("ANON KEY EXISTE?:", !!process.env.SUPABASE_ANON_KEY);
    
    const cookieStore = await cookies()

    return createServerClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet, _headers) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
                    } catch {
                        
                    }
                }
            }
        }
    )
}