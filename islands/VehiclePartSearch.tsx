import { useComputed, useSignal } from "@preact/signals";
import { VehiclePart } from "../types/vehicle-part.ts";

export default function VehiclePartSearch({
    vehicleParts
}: {
    vehicleParts: VehiclePart[]
}) {
    const currentAccordion = useSignal<number | null>(null);
    const search = useSignal("");
    const filteredVehicleParts = useComputed<VehiclePart[]>(() => vehicleParts.filter(vehiclePart => {
        const queryWords = search.value.toLowerCase().trim().split(" ");
        const nameWords = vehiclePart.name.toLowerCase().trim().split(" ");

        return queryWords.every(qw => nameWords.some(nw => nw.includes(qw)));
    }));

    const handlers = {
        accordionClick(id: number) {
            if (currentAccordion.value === id) currentAccordion.value = null;
            else currentAccordion.value = id;
        }
    }

    return (
        <>
            <div className="d-flex justify-content-center">
                <div>
                    <input onInput={(e) => search.value = e.target.value} type="text" className="form-control" placeholder="Search..." />
                </div>
            </div>
            <div className="mt-3">
                <div className="accordion">
                    {
                        filteredVehicleParts.value.map(vehiclePart =>
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
                                                <ul className="list-group">
                                                    {vehiclePart.partsToVehicleParts.map(part =>
                                                        <li className="list-group-item">
                                                            {part.description ? <div className="badge rounded-pill text-bg-secondary mb-1">{part.description}</div> : null}
                                                            <div>{part.parts.name}</div>
                                                            {part.quantity ? <div className="badge text-bg-info mt-2 p-2">{part.quantity}</div> : null}
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                    : null
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}