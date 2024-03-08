import { useSignal } from "@preact/signals";
import { State } from "../routes/_middleware.ts";
import { Part, partRaw } from "../types/part.ts";
import PartCreate from "./PartCreate.tsx";
import { useEffect } from "preact/hooks";

export default function VehicleDetail({
    contextState,
    partId,
}: {
    contextState: State,
    partId: number,
}) {
    const { apiUrl, token } = contextState;
    const part = useSignal<Part>(Object.assign({}, partRaw));

    useEffect(() => {
        const fetchData = async () => await refreshData();

        fetchData();
    }, []);

    async function refreshData() {
        const res = await fetch(`${apiUrl}/parts/${partId}`, {
            headers: { "Authorization": `Bearer ${token}`}
        });
        const jsonData = await res.json();
        part.value = jsonData;
    }

    async function deletePart() {
        await fetch(`${apiUrl}/parts/${partId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}`}
        });
        
        window.location.href = "/part";
    }

    if (!part.value) return <div className="container my-5"><div className="alert alert-danger">Part not found</div></div>
    if (!part.value.id) return <div className="container my-5"><h3 className="text-secondary text-center">Loading...</h3></div>

    return (
        <>
        <h1>{part.value.name}</h1>
        <div className="mt-3">
            <PartCreate
                onRefresh={refreshData}
                onSave="update"
                onDelete={deletePart}
                partData={part.value}
                contextState={contextState}
            />
        </div>
        </>
    )
}