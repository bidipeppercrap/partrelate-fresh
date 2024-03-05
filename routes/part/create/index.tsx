import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import PartCreate from "../../../islands/PartCreate.tsx";

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {
      return await ctx.render(ctx.state);
    },
};

export default function CreatePartPage(props: PageProps<State>) {
    return (
        <div className="container my-5">
            <h1>Create Part</h1>
            <div className="mt-3">
                <PartCreate contextState={props.data} />
            </div>
        </div>
    );
}