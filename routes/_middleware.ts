import { FreshContext } from "$fresh/server.ts";
import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";
import { getCookies } from "$std/http/cookie.ts";

interface State {
    token: string | null;
}

export async function handler(
    req: Request,
    ctx: FreshContext<State>
) {
    const env = await load();
    const apiUrl = env["API_URL"];
    const partrelateToken = getCookies(req.headers)["partrelateToken"];

    if (partrelateToken) {
        ctx.state.token = partrelateToken;
    } else {
        ctx.state.token = null;
        // NAVIGATE => LOGIN
    }

    return ctx.next();
}