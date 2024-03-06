import { useSignal } from "@preact/signals";
import { State } from "../routes/_middleware.ts";
import { VehicleDetail, vehicleDetailRaw } from "../types/vehicle-detail.ts";
import VehicleCreate from "./VehicleCreate.tsx";
import VehiclePartSearch from "./VehiclePartSearch.tsx";
import { VehiclePart } from "../types/vehicle-part.ts";
import { useEffect } from "preact/hooks";

export default function VehicleDetail({
    contextState,
    vehicleId,
}: {
    contextState: State,
    vehicleId: number,
}) {
    const { apiUrl, token } = contextState;
    const vehicle = useSignal<VehicleDetail>(Object.assign({}, vehicleDetailRaw));

    useEffect(() => {
        const fetchData = async () => await refreshData();

        fetchData();
    }, []);

    async function refreshData() {
        const res = await fetch(`${apiUrl}/vehicles/${vehicleId}`, {
            headers: { "Authorization": `Bearer ${token}`}
        });
        const jsonData = await res.json();
        vehicle.value = jsonData;
    }

    async function createVehiclePart(vehiclePart: VehiclePart) {
        await fetch(`${apiUrl}/vehicle_parts`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`},
            body: JSON.stringify(vehiclePart)
        });

        await refreshData();
    }

    async function deleteVehicle() {
        await fetch(`${apiUrl}/vehicles/${vehicleId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}`}
        });
        
        window.location.href = "/vehicle";
    }

    if (!vehicle.value) return <div className="container my-5"><div className="alert alert-danger">Vehicle not found</div></div>
    if (!vehicle.value.id) return <div className="container my-5"><h3 className="text-secondary text-center">Loading...</h3></div>

    return (
        <>
        <h1>{vehicle.value.name}</h1>
        <div className="mt-3">
            <VehicleCreate
                onRefresh={refreshData}
                onSave="update"
                onDelete={deleteVehicle}
                vehicleData={vehicle.value}
                contextState={contextState}
            />
            <hr />
            <h3 className="text-center">Parts</h3>
            <div className="mt-3">
                <VehiclePartSearch
                    vehicleId={vehicle.value.id!}
                    vehicleParts={vehicle.value.vehicleParts}
                    onCreate={createVehiclePart}
                />
            </div>
        </div>
        </>
    )
}