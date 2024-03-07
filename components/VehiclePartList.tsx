import { useSignal } from "@preact/signals";
import { VehiclePart } from "../types/vehicle-part.ts";
import PartToVehiclePartForm from "./PartToVehiclePartForm.tsx";
import { State } from "../routes/_middleware.ts";

export default function VehiclePartList({
    vehiclePartList,
    contextState,
    onRefresh
}: {
    vehiclePartList: VehiclePart[],
    contextState: State,
    onRefresh: () => Promise<void>
}) {
    const currentAccordion = useSignal<number | null>(null);
    const optionToggle = useSignal<null | number>(null);

    const handlers = {
        accordionClick(id: number) {
            if (currentAccordion.value === id) currentAccordion.value = null;
            else currentAccordion.value = id;
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
                                        {vehiclePart.description ? <div className="alert alert-secondary">{vehiclePart.description}</div> : null}
                                        {vehiclePart.note ? <div className="alert alert-warning">{vehiclePart.note}</div> : null}
                                        {vehiclePart.note || vehiclePart.description ? <hr /> : null}
                                        {
                                            vehiclePart.partsToVehicleParts.length > 0
                                            ? (
                                                <ul className="list-group">
                                                    {vehiclePart.partsToVehicleParts.map((part, i) =>
                                                        <li className="list-group-item">
                                                            <div className="row">
                                                                <div className="col">
                                                                    {part.description ? <div className="badge rounded-pill text-bg-secondary mb-1">{part.description}</div> : null}
                                                                    <div>{part.parts!.name}</div>
                                                                    {part.quantity ? <div className="badge text-bg-info mt-2 p-2">{part.quantity}</div> : null}
                                                                    {part.parts!.note ? <div><div className="badge text-bg-warning mt-2 p-2">{part.parts!.note}</div></div> : null}
                                                                </div>
                                                                <div className="col-auto">
                                                                    <div className="dropdown">
                                                                        <button onClick={() => optionToggle.value === i ? optionToggle.value = null : optionToggle.value = i} type="button" className="btn"><i className="bi-three-dots"></i></button>
                                                                    </div>
                                                                    <ul style={{minWidth: "unset"}} className={`dropdown-menu ${optionToggle.value === i ? "show" : ""}`}>
                                                                        <li><a role="button" className="dropdown-item text-secondary"><i className="bi-info"></i></a></li>
                                                                        <li><a role="button" className="dropdown-item text-primary"><i className="bi-pencil"></i></a></li>
                                                                        <li><a role="button" className="dropdown-item text-danger"><i className="bi-trash"></i></a></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
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