import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../_middleware.ts";
import PartSearch from "../../islands/PartSearch.tsx";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
      return await ctx.render(ctx.state);
    },
};

export default function PartPage(props: PageProps<State>) {
  return (
    <div className="container my-5">
      <h1>Part</h1>
      <div className="row mt-3">
        <PartSearch contextState={props.data} />
      </div>
    </div>
  );
}
