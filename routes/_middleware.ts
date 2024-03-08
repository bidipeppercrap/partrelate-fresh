import { FreshContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export interface State {
    token: string | null;
    apiUrl: string | null;
}

export function handler(
    req: Request,
    ctx: FreshContext<State>
) {
    const apiUrl = Deno.env.get("API_URL")!;
    const cookies = getCookies(req.headers);
    const partrelateToken = cookies.partrelateToken;

    ctx.state.apiUrl = apiUrl;

    if (partrelateToken) {
        ctx.state.token = partrelateToken;
        if (ctx.route.startsWith("/login")) {
            return new Response(null, {
                status: 301,
                headers: { Location: "/" }
            });
        }
    }
    if (!partrelateToken && !ctx.route.startsWith("/login")) {
        ctx.state.token = null;

        return new Response(null, {
            status: 301,
            headers: { Location: "/login" }
        });
    }

    return ctx.next();
}