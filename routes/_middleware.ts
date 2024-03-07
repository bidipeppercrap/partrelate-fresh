import { FreshContext } from "$fresh/server.ts";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";
import { getCookies } from "$std/http/cookie.ts";

export interface State {
    token: string | null;
    apiUrl: string | null;
}

export async function handler(
    req: Request,
    ctx: FreshContext<State>
) {
    const env = await load();
    const apiUrl = env["API_URL"];
    const partrelateToken = getCookies(req.headers)["partrelateToken"];

    ctx.state.apiUrl = apiUrl;

    if (partrelateToken) {
        ctx.state.token = partrelateToken;
        if (ctx.route.startsWith("/login")) {
            return new Response("", {
                status: 301,
                headers: { Location: "/" }
            });
        }
    }
    if (!partrelateToken && !ctx.route.startsWith("/login")) {
        ctx.state.token = null;

        return new Response("", {
            status: 301,
            headers: { Location: "/login" }
        });
    }

    return ctx.next();
}