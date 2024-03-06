import { useComputed, useSignal } from "@preact/signals";
import { VehiclePart, vehiclePartRaw } from "../types/vehicle-part.ts";
import VehiclePartList from "../components/VehiclePartList.tsx";

export default function VehiclePartSearch({
    vehicleId,
    vehicleParts,
    onCreate
}: {
    vehicleId: number,
    vehicleParts: VehiclePart[],
    onCreate: (vp: VehiclePart) => Promise<void>
}) {
    const mode = useSignal<"view" | "create">("view");
    const search = useSignal("");
    const filteredVehicleParts = useComputed<VehiclePart[]>(() => vehicleParts.filter(vehiclePart => {
        const queryWords = search.value.toLowerCase().trim().split(" ");
        const nameWords = vehiclePart.name.toLowerCase().trim().split(" ");

        return queryWords.every(qw => nameWords.some(nw => nw.includes(qw)));
    }));

    const newVehiclePart = useSignal<VehiclePart>(Object.assign({}, {...vehiclePartRaw, vehicleId: vehicleId }));

    const handlers = {
        clearForm() {
            search.value = "";
            newVehiclePart.value = Object.assign({}, {...vehiclePartRaw, vehicleId: vehicleId })
        },
        cancelCreate() {
            mode.value = "view";
            handlers.clearForm();
        },
        beginCreate() {
            mode.value = "create";
            handlers.clearForm();
        },
        async createVehiclePart() {
            const toCreate = Object.assign({}, {...newVehiclePart.value, name: search.value});

            await onCreate(toCreate);

            handlers.cancelCreate();
        }
    }

    return (
        <>
        {
            mode.value === "view"
            ? (
                <>
                <div className="d-flex justify-content-center">
                    <div className="row">
                        <div className="col-auto">
                            <input onInput={(e) => search.value = e.target.value} type="text" className="form-control" placeholder="Search..." />
                        </div>
                        <div className="col-auto">
                            <button onClick={handlers.beginCreate} type="button" className="btn btn-primary"><i className="bi-plus"></i></button>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    {
                        filteredVehicleParts.value.length > 0
                        ? <VehiclePartList vehiclePartList={filteredVehicleParts.value} />
                        : <h3 className="text-secondary text-center">No vehicle part found.</h3>
                    }
                </div>
                </>
            )
            : null
        }
        {
            mode.value === "create"
            ? (
                <div className="row">
                    <div className="col">
                        <input onInput={(e) => search.value = e.target.value} type="text" className="form-control" placeholder="Name" />
                        <div className="mt-2">
                            <textarea value={newVehiclePart.value.description} onInput={(e) => newVehiclePart.value = { ...newVehiclePart.value, description: e.target.value }} id="description" cols={30} rows={5} className="form-control" placeholder={"Description"}></textarea>
                        </div>
                        <div className="mt-2">
                            <textarea value={newVehiclePart.value.note} onInput={(e) => newVehiclePart.value = { ...newVehiclePart.value, note: e.target.value }} id="note" cols={30} rows={5} className="form-control" placeholder={"Note"}></textarea>
                        </div>
                        <div className="mt-3">
                            <div className="row g-2">
                                <div className="col-auto">
                                    <button onClick={handlers.createVehiclePart} type="button" className="btn btn-primary">Save</button>
                                </div>
                                <div className="col-auto">
                                    <button onClick={handlers.cancelCreate} type="button" className="btn btn-danger"><i className="bi-x"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <VehiclePartList vehiclePartList={filteredVehicleParts.value} />
                    </div>
                </div>
            )
            : null
        }
        </>
    )
}