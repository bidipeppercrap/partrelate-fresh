import { useComputed, useSignal } from "@preact/signals";
import { VehiclePart, vehiclePartRaw } from "../types/vehicle-part.ts";
import VehiclePartList from "../components/VehiclePartList.tsx";
import { State } from "../routes/_middleware.ts";
import VehiclePartForm from "../components/VehiclePartForm.tsx";

export default function VehiclePartSearch({
    contextState,
    vehicleId,
    vehicleParts,
    onCreate,
    onUpdate,
    onDelete,
    onRefresh
}: {
    contextState: State,
    vehicleId: number,
    vehicleParts: VehiclePart[],
    onCreate: (vp: VehiclePart) => Promise<void>,
    onUpdate: (vp: VehiclePart) => Promise<void>,
    onDelete?: (id: number) => Promise<void>,
    onRefresh: () => Promise<void>
}) {
    const mode = useSignal<"view" | "create" | "edit">("view");
    const search = useSignal("");
    const filteredVehicleParts = useComputed<VehiclePart[]>(() => {
        const rawList = [...vehicleParts];

        return rawList.filter(vehiclePart => {
            if (newVehiclePart.value.id && vehiclePart.id === newVehiclePart.value.id) return false;

            const queryWords = search.value.toLowerCase().trim().split(" ");
            const nameWords = vehiclePart.name.toLowerCase().trim().split(" ");

            return queryWords.every(qw => nameWords.some(nw => nw.includes(qw)));
        });
    });

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
        beginEdit(vp: VehiclePart) {
            search.value = vp.name;
            mode.value = "edit";
            newVehiclePart.value = vp;
        },
        async createVehiclePart() {
            const toCreate = Object.assign({}, {...newVehiclePart.value, name: search.value});

            await onCreate(toCreate);

            handlers.cancelCreate();
        },
        async updateVehiclePart() {
            const toCreate = Object.assign({}, {...newVehiclePart.value, name: search.value});

            await onUpdate(toCreate);

            handlers.cancelCreate();
        },
        async deleteVehiclePart(id: number) {
            if (onDelete) await onDelete(id);
        }
    }

    async function refresh() {
        await onRefresh();
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
                        vehicleParts.length > 0
                        ? <VehiclePartList
                            onDelete={handlers.deleteVehiclePart}
                            onEdit={handlers.beginEdit}
                            onRefresh={refresh}
                            contextState={contextState}
                            vehiclePartList={vehicleParts}
                        />
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
                <VehiclePartForm
                    contextState={contextState}
                    vehiclePart={newVehiclePart.value}
                    vehicleParts={filteredVehicleParts.value}
                    onRefresh={onRefresh}
                    onSave={handlers.createVehiclePart}
                    onCancel={handlers.cancelCreate}
                    onInputChange={{
                        nameChange: (e) => {search.value = e.target.value; newVehiclePart.value = { ...newVehiclePart.value, name: e.target.value};},
                        descriptionChange: (e) => newVehiclePart.value = { ...newVehiclePart.value, description: e.target.value },
                        noteChange: (e) => newVehiclePart.value = { ...newVehiclePart.value, note: e.target.value }
                    }}
                />
            )
            : null
        }
        {
            mode.value === "edit"
            ? <VehiclePartForm
                contextState={contextState}
                vehiclePart={newVehiclePart.value}
                vehicleParts={filteredVehicleParts.value}
                onRefresh={onRefresh}
                onSave={handlers.updateVehiclePart}
                onCancel={handlers.cancelCreate}
                onInputChange={{
                    nameChange: (e) => {search.value = e.target.value; newVehiclePart.value = { ...newVehiclePart.value, name: e.target.value};},
                    descriptionChange: (e) => newVehiclePart.value = { ...newVehiclePart.value, description: e.target.value },
                    noteChange: (e) => newVehiclePart.value = { ...newVehiclePart.value, note: e.target.value }
                }}
            />
            : null
        }
        </>
    )
}