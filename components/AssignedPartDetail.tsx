import { useSignal } from "@preact/signals";
import { PartToVehiclePart } from "../types/part-to-vehicle-part.ts";
import PartToVehiclePartForm from "./PartToVehiclePartEditForm.tsx";
import { State } from "../routes/_middleware.ts";

export default function AssignedPartDetail({
    contextState,
    assignedPart,
    optionToggle,
    onOptionToggle,
    onUpdate,
    onDelete
}: {
    contextState: State;
    assignedPart: PartToVehiclePart;
    optionToggle: boolean;
    onOptionToggle: () => void;
    onUpdate?: (p: PartToVehiclePart) => Promise<void>;
    onDelete?: (p: PartToVehiclePart) => void;
}) {
    const mode = useSignal<"view" | "edit" | "description">("view");
    const updateLoading = useSignal(false);

    const handlers = {
        descriptionOptionClick() {
            mode.value = "description";
            onOptionToggle();
        },
        editOptionClick() {
            mode.value = "edit";
            onOptionToggle();
        },
        async beginUpdate(ap: PartToVehiclePart) {
            updateLoading.value = true;

            if (onUpdate) await onUpdate(ap);

            updateLoading.value = false;
            mode.value = "view";
        },
        deletePart() {
            if (onDelete) onDelete(assignedPart);
        }
    }

    return (
        <div className="row">
            {
                mode.value === "description"
                ? (
                    <>
                    <div className="col">
                        <h5>{assignedPart.parts!.name}</h5>
                        <div className="alert alert-secondary">
                            {assignedPart.parts!.description}
                        </div>
                        <div className="alert alert-warning">
                            {assignedPart.parts!.note}
                        </div>
                    </div>
                    <div className="col-auto">
                        <button onClick={() => mode.value = "view"} type="button" className="btn"><i className="bi-x"></i></button>
                    </div>
                    </>
                ) :
                null
            }
            {
                mode.value === "edit"
                ? (
                    updateLoading.value
                    ? (
                        <h5 className="text-center text-secondary my-5">Loading...</h5>
                    )
                    : (
                        <>
                        <div className="col">
                            <PartToVehiclePartForm
                                contextState={contextState}
                                assignedPart={assignedPart}
                                onSave={handlers.beginUpdate}
                            />
                        </div>
                        <div className="col-auto">
                            <button onClick={() => mode.value = "view"} type="button" className="btn"><i className="bi-x"></i></button>
                        </div>
                        </>
                    )
                ) :
                null
            }
            {
                mode.value === "view"
                ? (
                    <>
                    <div className="col">
                        {assignedPart.description ? <div className="badge rounded-pill text-bg-secondary mb-1">{assignedPart.description}</div> : null}
                        <div>{assignedPart.parts!.name}</div>
                        {assignedPart.quantity ? <div className="badge text-bg-info mt-2 p-2">{assignedPart.quantity}</div> : null}
                        {assignedPart.parts!.note ? <div><div className="badge text-bg-warning mt-2 p-2">{assignedPart.parts!.note}</div></div> : null}
                    </div>
                    <div className="col-auto">
                        <div className="dropdown">
                            <button onClick={onOptionToggle} type="button" className="btn"><i className="bi-three-dots"></i></button>
                        </div>
                        <ul style={{minWidth: "unset"}} className={`dropdown-menu ${optionToggle ? "show" : ""}`}>
                            {
                                assignedPart.parts!.description
                                ? <li><a onClick={handlers.descriptionOptionClick} role="button" className="dropdown-item text-secondary"><i className="bi-info"></i></a></li>
                                : null
                            }
                            {
                                onUpdate
                                ? <li><a onClick={handlers.editOptionClick} role="button" className="dropdown-item text-primary"><i className="bi-pencil"></i></a></li>
                                : null
                            }
                            {
                                onDelete
                                ? <li><a onClick={handlers.deletePart} role="button" className="dropdown-item text-danger"><i className="bi-trash"></i></a></li>
                                : null
                            }
                        </ul>
                    </div>
                    </>
                )
                : null
            }
        </div>
    );
}