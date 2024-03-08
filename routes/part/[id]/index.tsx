import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import PartDetailContent from "../../../islands/PartDetail.tsx";

export const handler: Handlers<State> = {
    GET(_req, ctx) {
      return ctx.render(ctx.state);
    },
  };

export default function PartDetailPage(props: PageProps<State>) {
    const { id } = props.params;
    const partId: number = Number.isNaN(id) ? 0 : parseInt(id);

    return (
        <div className="container my-5">
            <PartDetailContent contextState={props.data} partId={partId} />
        </div>
    );
}