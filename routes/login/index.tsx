import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
      return await ctx.render();
    },
    async POST(req, ctx) {
      const form = await req.formData();
      const username = form.get("username")?.toString();
      const key = form.get("key")?.toString();

      const response = await fetch("");
      console.log(response);
      const jsonData = await response.json();
  
      const headers = new Headers();
      headers.set("location", "/");

      return new Response(null, {
        status: 303,
        headers,
      });
    },
  };

export default function LoginPage() {
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
                            <input id="username" type="text" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="key" className="form-label"><i className="bi-key"></i></label>
                            <input id="key" type="password" className="form-control" />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}