import { Handlers, PageProps } from "$fresh/server.ts";
import { Cookie, setCookie } from "$std/http/cookie.ts";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
        return await ctx.render();
    },
    async POST(req, ctx) {
        const { apiUrl } = ctx.state;
        const form = await req.formData();
        const username = form.get("username")?.toString();
        const password = form.get("password")?.toString();
        const headers = new Headers();

        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            body: JSON.stringify({ username, password })
        });
        const jsonData = await response.text();

        if (response.status !== 200) {
            headers.set("location", `/login?error=${jsonData}`);
            return new Response(null, {
                status: 303,
                headers
            });
        }

        const tokenCookie: Cookie = { name: "partrelateToken", value: jsonData };
        setCookie(headers, tokenCookie);
        headers.set("location", "/");

        return new Response(null, {
            status: 303,
            headers,
        });
    },
};

export default function LoginPage(props: PageProps) {
    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    Login
                </div>
                <div className="card-body">
                    <form method="POST">
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input id="username" name="username" type="text" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label"><i className="bi-key"></i></label>
                            <input id="password" name="password" type="password" className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}