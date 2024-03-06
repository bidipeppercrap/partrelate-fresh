import { useEffect, useState } from "preact/hooks";
import { State } from "../routes/_middleware.ts";
import { SearchList } from "../types/search-list.ts";
import { Vehicle } from "../types/vehicle.ts";
import DebouncedSearch from "../components/DebouncedSearch.tsx";
import { useSignal } from "@preact/signals";

const vehicleRaw: Vehicle = {
    name: "",
    description: "",
    note: ""
}

export default function VehicleCreate({
    contextState,
    vehicleData,
    onSave,
    onRefresh,
    onDelete
}: {
    contextState: State,
    vehicleData?: Vehicle,
    onSave: "create" | "update",
    onRefresh?: () => Promise<void>,
    onDelete?: () => Promise<void>
}) {
    const { apiUrl, token } = contextState;
    const [search, setSearch] = useState<SearchList<Vehicle>>({
        loading: false,
        query: "",
        pagination: {
            currentPage: 1,
            totalPages: 1
        },
        list: []
    });
    const [vehicle, setVehicle] = useState<Vehicle>(Object.assign({}, vehicleData || vehicleRaw));
    const [mode, setMode] = useState<"edit" | "view">(onSave === "update" ? "view" : "edit");
    const deleteConfirmation = useSignal(false);

    useEffect(() => {
        const beginSearching = async () => await searchVehicle(search.query, 1);
        beginSearching();
    }, [search.query]);

    async function searchVehicle(q: string, page: number) {
        if (q.length < 3) return;

        setSearch(prev => ({ ...prev, loading: true }));
        const res = await fetch(`${apiUrl}/vehicles?keyword=${q}&page=${page}`, {
            headers: { "Authorization": `Bearer ${token}`}
        })

        const jsonData = await res.json();

        setSearch(prev => ({
            ...prev,
            loading: false,
            list: jsonData.data
        }));
    }

    function clearForm() {
        setVehicle(Object.assign({}, vehicleRaw));
    }

    async function createVehicle(vehicle: Vehicle) {
        await fetch(`${apiUrl}/vehicles`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`},
            body: JSON.stringify(vehicle)
        });

        clearForm();
    }

    async function updateVehicle(vehicle: Vehicle) {
        await fetch(`${apiUrl}/vehicles/${vehicle.id}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}`},
            body: JSON.stringify(vehicle)
        });

        if (onRefresh) await onRefresh();

        setMode("view");
    }

    const handlers = {
        searchChange(q: string) {
            setSearch(prev => ({ ...prev, query: q }));
        },
        cancelForm() {
            if (onSave === "create") clearForm();
            if (onSave === "update") setMode("view");
        },
        async saveVehicle() {
            if (onSave === "create") await createVehicle(vehicle);
            if (onSave === "update") await updateVehicle(vehicle);
        },
        async handleSearchKeyUp(e: Event) {
            if (e.key === "Enter") await handlers.saveVehicle();
        }
    }

    const listGenerate = () => {
        if (search.loading) return <h3 className="text-secondary text-center">Loading...</h3>;
        if (!search.loading && search.list.length < 1 && vehicle.name.length >= 3) return <h3 className="text-secondary text-center">No possible duplicates</h3>;
        if (!search.loading && search.list.length > 0 && vehicle.name.length >= 3) return (
            <div>
                <h5 className="text-secondary text-center">Possible duplicates</h5>
                <ul className="list-group mt-3">
                    {
                        search.list.map(vehicle =>
                            <li key={vehicle.id} className="list-group-item">{vehicle.name}</li>
                        )
                    }
                </ul>
            </div>
        );
        return <h3 className="text-secondary text-center">Type atleast 3 character name</h3>;
    }

    return (
        <div className="row">
            {
                mode === "view"
                ? (
                    <div className="row">
                        <div className="col">
                            {
                                deleteConfirmation.value
                                ? (
                                    <>
                                    <div className="col-auto fw-bold text-secondary">You sure?</div>
                                    <div className="row g-2 align-items-center mt-1">
                                        <div className="col-auto">
                                            <button onClick={onDelete} type="button" className="btn btn-outline-secondary">Yes</button>
                                        </div>
                                        <div className="col-auto">
                                            <button onClick={() => deleteConfirmation.value = false} type="button" className="btn btn-outline-secondary">No</button>
                                        </div>
                                    </div>
                                    </>
                                ) : (
                                    <div className="row g-2">
                                        <div className="col-auto">
                                            <button onClick={() => setMode("edit")} type="button" className="btn btn-primary"><i className="bi-pencil"></i></button>
                                        </div>
                                        {
                                            onDelete
                                            ? (
                                                <div className="col-auto">
                                                    <button onClick={() => deleteConfirmation.value = true} type="button" className="btn btn-danger"><i className="bi-trash"></i></button>
                                                </div>
                                            )
                                            : null
                                        }
                                    </div>
                                )
                            }
                            
                            {vehicle.description ? <div className="alert alert-secondary mt-2">{vehicle.description}</div> : null}
                            {vehicle.note ? <div className="alert alert-warning mt-2">{vehicle.note}</div> : null}
                        </div>
                        <div className="col"></div>
                    </div>
                ) : null
            }
            {
                mode === "edit"
                ? (
                    <>
                    <div className="col">
                        <DebouncedSearch
                            value={vehicle.name}
                            placeholder="Name"
                            onKeyUp={handlers.handleSearchKeyUp}
                            minCharacter={3}
                            onSearchChange={(value) => setVehicle(prev => ({ ...prev, name: value }))}
                            onLoading={() => setSearch(prev => ({ ...prev, loading: true }))}
                            onBeginSearching={handlers.searchChange}
                        />
                        <div className="mt-2">
                            <textarea value={vehicle.description} onInput={(e) => setVehicle(prev => ({ ...prev, description: e.target.value }))} id="description" cols={30} rows={5} className="form-control" placeholder={"Description"}></textarea>
                        </div>
                        <div className="mt-2">
                            <textarea value={vehicle.note} onInput={(e) => setVehicle(prev => ({ ...prev, note: e.target.value }))} id="note" cols={30} rows={5} className="form-control" placeholder={"Note"}></textarea>
                        </div>
                        <div className="mt-2">
                            <div className="row g-2">
                                <div className="col-auto">
                                    <button onClick={handlers.saveVehicle} type="button" className="btn btn-primary">Save</button>
                                </div>
                                <div className="col"></div>
                                <div className="col-auto">
                                    <button onClick={handlers.cancelForm} type="button" className="btn btn-danger"><i className="bi-x"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        {listGenerate()}
                    </div>
                    </>
                ) : null
            }
        </div>
    );
}