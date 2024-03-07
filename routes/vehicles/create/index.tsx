import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import VehicleCreate from "../../../islands/VehicleCreate.tsx";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
      return await ctx.render(ctx.state);
    },
};

export default function CreateVehiclePage(props: PageProps<State>) {
    return (
        <div className="container my-5">
            <h1>Create Vehicle</h1>
            <div className="mt-3">
                <VehicleCreate onSave={"create"} contextState={props.data} />
            </div>
        </div>
    );
}