import { Handlers, PageProps } from "$fresh/server.ts";
import VehicleSearch from "../../islands/VehicleSearch.tsx";
import { State } from "../_middleware.ts";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
      return await ctx.render(ctx.state);
    },
};

export default function VehiclePage(props: PageProps<State>) {
  return (
    <div className="container my-5">
      <h1>Vehicle</h1>
      <div className="row mt-3">
        <VehicleSearch contextState={props.data} />
      </div>
    </div>
  );
}
