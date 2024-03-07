import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import VehicleDetailContent from "../../../islands/VehicleDetail.tsx";

export const handler: Handlers<State> = {
    GET(_req, ctx) {
      return ctx.render(ctx.state);
    },
  };

export default function VehicleDetailPage(props: PageProps<State>) {
    const { id } = props.params;
    const vehicleId: number = Number.isNaN(id) ? 0 : parseInt(id);

    return (
        <div className="container my-5">
            <VehicleDetailContent contextState={props.data} vehicleId={vehicleId} />
        </div>
    );
}