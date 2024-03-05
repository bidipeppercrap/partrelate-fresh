import { FreshContext } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import VehicleCreate from "../../../islands/VehicleCreate.tsx";
import { VehicleDetail } from "../../../types/vehicle-detail.ts";
import VehiclePartSearch from "../../../islands/VehiclePartSearch.tsx";

export default async function VehicleDetailPage(_req, ctx: FreshContext<State>) {
    const { apiUrl, token } = ctx.state;
    const res = await fetch(`${apiUrl}/vehicles/${ctx.params.id}`, {
        headers: { "Authorization": `Bearer ${token}`}
    })
    const jsonData = await res.json();
    const vehicle: VehicleDetail = await jsonData;

    if (!vehicle) return <div className="container my-5"><div className="alert alert-danger">Vehicle not found</div></div>

    return (
        <div className="container my-5">
            <h1>{vehicle.name}</h1>
            <div className="mt-3">
                <VehicleCreate onSave="update" vehicleData={vehicle} contextState={ctx.state} />
                <hr />
                <h3 className="text-center">Parts</h3>
                <div className="mt-3">
                    <VehiclePartSearch vehicleParts={vehicle.vehicleParts} />
                </div>
            </div>
        </div>
    );
}