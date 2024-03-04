import { useState } from "preact/hooks";
import DebouncedSearch from "../components/DebouncedSearch.tsx";
import { State } from "../routes/_middleware.ts";
import { useSignal } from "@preact/signals";

export default function VehicleSearch({
    contextState
}: {
    contextState: State
}) {
    const { apiUrl, token } = contextState;
    const [loading, setLoading] = useState(false);

    const vehicles = useSignal([]);

    async function searchVehicle(q: string) {
        const res = await fetch(`${apiUrl}/vehicles?keyword=${q}`, {
            headers: { "Authorization": `Bearer ${token}`}
        })

        const jsonData = await res.json();

        vehicles.value = jsonData.data;
    }

    return (
        <>
            <div className="row">
                <div className="col-auto">
                    <DebouncedSearch setLoading={setLoading} searchFunction={searchVehicle} />
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-primary"><i className="bi-plus"></i></button>
                </div>
            </div>
            <div className="mt-3">
                {
                    loading ? <h3 className="text-secondary text-center">Loading...</h3> : null
                }
                {
                    !loading && vehicles.value.length < 1 ? <h3 className="text-secondary text-center">No vehicle found</h3> : null
                }
                {
                    !loading && vehicles.value.length > 0
                    ? (
                        <div className="list-group">
                            {
                                vehicles.value.map(vehicle =>
                                    <a key={vehicle.id} href="#" className="list-group-item list-group-item-action">{vehicle.name}</a>
                                )
                            }
                        </div>
                    )
                    : null
                }
            </div>
        </>
    );
}