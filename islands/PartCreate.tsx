import { useEffect, useState } from "preact/hooks";
import { State } from "../routes/_middleware.ts";
import { SearchList } from "../types/search-list.ts";
import { Part } from "../types/part.ts";
import DebouncedSearch from "../components/DebouncedSearch.tsx";
import { useSignal } from "@preact/signals";

const partRaw: Part = {
    name: "",
    description: "",
    note: ""
}

export default function PartCreate({
    contextState,
    partData,
    onSave,
    onRefresh,
    onDelete
}: {
    contextState: State,
    partData: Part,
    onSave: "create" | "update",
    onRefresh?: () => Promise<void>,
    onDelete?: () => Promise<void>
}) {
    const { apiUrl, token } = contextState;
    const [search, setSearch] = useState<SearchList<Part>>({
        loading: false,
        query: "",
        pagination: {
            currentPage: 1,
            totalPages: 1
        },
        list: []
    });
    const [part, setPart] = useState<Part>(Object.assign({}, partData || partRaw));
    const [mode, setMode] = useState<"edit" | "view">(onSave === "update" ? "view" : "edit")
    const deleteConfirmation = useSignal(false);

    useEffect(() => {
        const beginSearching = async () => await searchPart(search.query, 1);
        beginSearching();
    }, [search.query]);

    async function searchPart(q: string, page: number) {
        if (q.length < 3) return;

        setSearch(prev => ({ ...prev, loading: true }));
        const res = await fetch(`${apiUrl}/parts?keyword=${q}&page=${page}`, {
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
        setPart(Object.assign({}, partRaw));
    }

    async function createPart(part: Part) {
        await fetch(`${apiUrl}/parts`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`},
            body: JSON.stringify(part)
        });

        clearForm();
    }

    async function updatePart(part: Part) {
        await fetch(`${apiUrl}/parts/${part.id}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}`},
            body: JSON.stringify(part)
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
            if (onSave === "update") {
                setPart(Object.assign({}, partData))
                setMode("view")
            }
        },
        async savePart() {
            if (onSave === "create") await createPart(part);
            if (onSave === "update") await updatePart(part);
        },
        async handleSearchKeyUp(e: Event) {
            if (e.key === "Enter") await handlers.savePart();
        },
    }

    const listGenerate = () => {
        if (search.loading) return <h3 className="text-secondary text-center">Loading...</h3>;
        if (!search.loading && search.list.length < 1 && part.name.length >= 3) return <h3 className="text-secondary text-center">No possible duplicates</h3>;
        if (!search.loading && search.list.length > 0 && part.name.length >= 3) return (
            <div>
                <h5 className="text-secondary text-center">Possible duplicates</h5>
                <ul className="list-group mt-3">
                    {
                        search.list.map(part =>
                            <li key={part.id} className="list-group-item">{part.name}</li>
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
                            
                            {part.description ? <div className="alert alert-secondary mt-2">{part.description}</div> : null}
                            {part.note ? <div className="alert alert-warning mt-2">{part.note}</div> : null}
                        </div>
                        <div className="col"></div>
                    </div>
                )
                : null
            }
            {
                mode === "edit"
                ? (
                    <>
                    <div className="col">
                        <DebouncedSearch
                            onKeyUp={handlers.handleSearchKeyUp}
                            value={part.name}
                            placeholder="Name"
                            minCharacter={3}
                            onSearchChange={(value) => setPart(prev => ({ ...prev, name: value }))}
                            onLoading={() => setSearch(prev => ({ ...prev, loading: true }))}
                            onBeginSearching={handlers.searchChange}
                        />
                        <div className="mt-2">
                            <textarea value={part.description} onInput={(e) => setPart(prev => ({ ...prev, description: e.target.value }))} id="description" cols={30} rows={5} className="form-control" placeholder={"Description"}></textarea>
                        </div>
                        <div className="mt-2">
                            <textarea value={part.note} onInput={(e) => setPart(prev => ({ ...prev, note: e.target.value }))} id="note" cols={30} rows={5} className="form-control" placeholder={"Note"}></textarea>
                        </div>
                        <div className="mt-2">
                            <div className="row g-2">
                                <div className="col-auto">
                                    <button onClick={handlers.savePart} type="button" className="btn btn-primary">Save</button>
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