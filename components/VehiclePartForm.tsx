import { useRef } from "preact/hooks";
import { State } from "../routes/_middleware.ts";
import { VehiclePart } from "../types/vehicle-part.ts";
import VehiclePartList from "./VehiclePartList.tsx";

export default function VehiclePartForm({
    contextState,
    vehicleParts,
    vehiclePart,
    onRefresh,
    onSave,
    onCancel,
    onInputChange
}: {
    contextState: State,
    vehicleParts: VehiclePart[],
    vehiclePart: VehiclePart,
    onRefresh: () => Promise<void>,
    onSave: () => Promise<void>,
    onCancel: () => void,
    onInputChange: {
        nameChange: (e) => void,
        descriptionChange: (e) => void,
        noteChange: (e) => void
    }
}) {
    return (
        <div className="row">
            <div className="col">
                <input value={vehiclePart.name} onInput={onInputChange.nameChange} type="text" className="form-control" placeholder="Name" />
                <div className="mt-2">
                    <textarea value={vehiclePart.description} onInput={onInputChange.descriptionChange} id="description" cols={30} rows={5} className="form-control" placeholder={"Description"}></textarea>
                </div>
                <div className="mt-2">
                    <textarea value={vehiclePart.note} onInput={onInputChange.noteChange} id="note" cols={30} rows={5} className="form-control" placeholder={"Note"}></textarea>
                </div>
                <div className="mt-3">
                    <div className="row g-2">
                        <div className="col-auto">
                            <button onClick={onSave} type="button" className="btn btn-primary">Save</button>
                        </div>
                        <div className="col-auto">
                            <button onClick={onCancel} type="button" className="btn btn-danger"><i className="bi-x"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col">
                <VehiclePartList onRefresh={onRefresh} contextState={contextState} vehiclePartList={vehicleParts} />
            </div>
        </div>
    );
}