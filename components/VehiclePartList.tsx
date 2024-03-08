import { useSignal } from "@preact/signals";
import { VehiclePart } from "../types/vehicle-part.ts";
import PartToVehiclePartForm from "./PartToVehiclePartForm.tsx";
import { State } from "../routes/_middleware.ts";
import AssignedPartDetail from "./AssignedPartDetail.tsx";
import { PartToVehiclePart } from "../types/part-to-vehicle-part.ts";

export default function VehiclePartList({
    vehiclePartList,
    contextState,
    onRefresh,
    onEdit,
    onDelete
}: {
    vehiclePartList: VehiclePart[],
    contextState: State,
    onRefresh: () => Promise<void>,
    onEdit?: (vp: VehiclePart) => void,
    onDelete?: (id: number) => Promise<void>
}) {
    const { apiUrl, token } = contextState;
    const currentAccordion = useSignal<number | null>(null);
    const optionToggle = useSignal<null | number>(null);

    const handlers = {
        accordionClick(id: number) {
            if (currentAccordion.value === id) currentAccordion.value = null;
            else currentAccordion.value = id;
        },
        async updateAssignedPart(assignedPart: PartToVehiclePart) {
            optionToggle.value = null;

            await fetch(`${apiUrl}/parts_to_vehicle_parts/${assignedPart.id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}`},
                body: JSON.stringify(assignedPart)
            });

            await onRefresh();
        },
        async deleteAssignedPart(assignedPart: PartToVehiclePart) {
            optionToggle.value = null;

            await fetch(`${apiUrl}/parts_to_vehicle_parts/${assignedPart.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}`}
            });

            await onRefresh();
        }
    }

    async function refresh() {
        await onRefresh();
    }

    return (
        <div className="accordion">
            {
                vehiclePartList.map(vehiclePart =>
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button onClick={() => handlers.accordionClick(vehiclePart.id!)} type="button" className={`accordion-button ${vehiclePart.id === currentAccordion.value ? "" : "collapsed"}`}>{vehiclePart.name}</button>
                        </h2>
                        {
                            vehiclePart.id === currentAccordion.value
                            ? (
                                <div className="accordion-collapse collapse show">
                                    <div className="accordion-body">
                                        <div className="row mb-3">
                                            {
                                                onEdit
                                                ? (
                                                    <div className="col-auto">
                                                        <button onClick={() => onEdit(vehiclePart)} type="button" className="btn btn-primary"><i className="bi-pencil"></i></button>
                                                    </div>
                                                )
                                                : null
                                            }
                                            {
                                                onDelete
                                                ? (
                                                    <div className="col-auto">
                                                        <button onClick={() => onDelete(vehiclePart.id!)} type="button" className="btn btn-danger"><i className="bi-trash"></i></button>
                                                    </div>
                                                )
                                                : null
                                            }
                                        </div>
                                        {vehiclePart.description ? <div className="alert alert-secondary">{vehiclePart.description}</div> : null}
                                        {vehiclePart.note ? <div className="alert alert-warning">{vehiclePart.note}</div> : null}
                                        {vehiclePart.note || vehiclePart.description ? <hr /> : null}
                                        {
                                            vehiclePart.partsToVehicleParts.length > 0
                                            ? (
                                                <ul className="list-group">
                                                    {vehiclePart.partsToVehicleParts.map((part, i) =>
                                                        <li className="list-group-item">
                                                            <AssignedPartDetail
                                                                contextState={contextState}
                                                                assignedPart={part}
                                                                optionToggle={optionToggle.value === i}
                                                                onOptionToggle={() => optionToggle.value === i ? optionToggle.value = null : optionToggle.value = i}
                                                                onUpdate={(ap) => handlers.updateAssignedPart(ap)}
                                                                onDelete={(p) => handlers.deleteAssignedPart(p)}
                                                            />
                                                        </li>
                                                    )}
                                                </ul>
                                            )
                                            : <h5 className="text-secondary text-center">No part yet</h5>
                                        }
                                        <div className="mt-3">
                                            <PartToVehiclePartForm onRefresh={refresh} contextState={contextState} vehiclePartId={vehiclePart.id} />
                                        </div>
                                    </div>
                                </div>
                            )
                            : null
                        }
                    </div>
                )
            }
        </div>
    );
}