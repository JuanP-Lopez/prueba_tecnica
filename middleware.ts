import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request : NextRequest) {
    const response = NextResponse.next();
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/dashboard")) {
        const lastAction = request.cookies.get("lastAction")?.value;
        const sessionCookie = request.cookies.get("current_session")?.value;
        const now = Date.now();

        const PERIODO_INACTIVIDAD = 5 * 60 * 1000;

        if (lastAction) {
            const tiempoTranscurrido = now - parseInt(lastAction);

            if (tiempoTranscurrido > PERIODO_INACTIVIDAD) {
                const supabase = createServerClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    {
                        cookies: {
                            get(name) {
                                return request.cookies.get(name)?.value;
                            },
                            set(name, value, options) {
                                response.cookies.set({name, value, ...options});
                            },
                            remove(name, options) {
                                response.cookies.set({
                                    name, value: "", ...options
                                });
                            },
                        }
                    }
                );

                await supabase.auth.signOut();

                const loginUrl = new URL("/", request.url);
                loginUrl.searchParams.set("error", "timeout");

                const redirectResponse = NextResponse.redirect(loginUrl);

                redirectResponse.cookies.delete("lastAction");
                return redirectResponse;
            }
        } else {
            response.cookies.set("lastAction", now.toString(), { path: "/"} );
        }

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name) {return request.cookies.get(name)?.value},
                    set(name, value, options) {
                        response.cookies.set({
                            name, value, ...options
                        });
                    },
                    remove(name, options) {
                        response.cookies.set({
                            name, value: "", ...options
                        });
                    },
                }
            }
        );

        const { data: {user}, error } = await supabase.auth.getUser();

        if (user) {
            const { data: is_same_session } = await supabase
                .from("manejo_session")
                .select("session_id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (is_same_session && is_same_session.session_id !== sessionCookie) {
                await supabase.auth.signOut();

                const signUpUrl = new URL("/", request.url);
                signUpUrl.searchParams.set("error", "multisession");

                const redirectResponse = NextResponse.redirect(signUpUrl);
                redirectResponse.cookies.delete("current_session");
                redirectResponse.cookies.delete("lastAction");
                return redirectResponse;
            }
        }

    }

    return response;
}

export const config = {
    matcher: ["/dashboard/:path*"],
};