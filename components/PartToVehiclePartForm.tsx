import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { Part } from "../types/part.ts";
import { State } from "../routes/_middleware.ts";
import DebouncedSearch from "./DebouncedSearch.tsx";
import { useRef } from "preact/hooks";
import { PartToVehiclePart } from "../types/part-to-vehicle-part.ts";

export default function PartToVehiclePartForm({
    contextState,
    vehiclePartId,
    onRefresh
}: {
    contextState: State
    vehiclePartId: number,
    onRefresh: () => Promise<void>
}) {
    const { apiUrl, token } = contextState;

    const descriptionInput = useRef(null);
    const descriptionValue = useSignal("");
    const qtyValue = useSignal("");

    const showSelector = useSignal(false);
    const selectorLoading = useSignal(false);
    const selectorItems = useSignal<Part[]>([]);
    const selectorItemsSliced = useComputed(() => selectorItems.value.slice(0, 5));
    const selectorIndex = useSignal<number | null>(null);
    const selectedPart = useSignal<Part | null>(null);

    const partValue = useSignal("");
    const partSearchValue = useSignal("");

    const partCreateLoading = useSignal(false);

    useSignalEffect(() => {
        const beginSearching = async (q: string) => await searchParts(q);

        beginSearching(partSearchValue.value);
    });

    function clearForm() {
        partValue.value = "";
        partSearchValue.value = "";
        descriptionValue.value = "";
        qtyValue.value = "";
    }

    async function searchParts(q: string) {
        selectorLoading.value = true;

        const res = await fetch(`${apiUrl}/parts?keyword=${q}`, {
            headers: { "Authorization": `Bearer ${token}`}
        });

        const jsonData = await res.json();

        selectorItems.value = jsonData.data;
        if (selectorItems.value) selectorIndex.value = 0;
        selectorLoading.value = false;
    }

    async function createPart(name: string) {
        partCreateLoading.value = true;

        const newPart: Part = {
            name: name,
            description: "",
            note: ""
        };

        const res = await fetch(`${apiUrl}/parts`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`},
            body: JSON.stringify(newPart)
        })

        const jsonData = await res.json();

        selectedPart.value = jsonData;

        partCreateLoading.value = false;
        if (descriptionInput.current) descriptionInput.current.focus();
    }

    function selectorSelect() {
        if (selectorIndex.value === null) return createPart(partValue.value);
        if (selectorIndex.value !== null) selectedPart.value = selectorItemsSliced.value[selectorIndex.value];
        if (descriptionInput.current) descriptionInput.current.focus();
    }

    function moveSelector(step: number) {
        if (selectorIndex.value === null && selectorItemsSliced.value.length === 0) return;
        if (selectorIndex.value === null && step === 1) return selectorIndex.value = 0;
        if (selectorIndex.value === null && step === -1) return selectorIndex.value = selectorItemsSliced.value.length -1;
        if (selectorIndex.value === 0 && step === -1) return selectorIndex.value = null;
        if (selectorIndex.value === selectorItemsSliced.value.length -1 && step === 1) return selectorIndex.value = null;
        if (selectorIndex.value !== null) return selectorIndex.value += step;
    }

    async function createPartToVehiclePart() {
        if (!selectedPart.value) return;

        const newData: PartToVehiclePart = {
            vehiclePartId: vehiclePartId,
            partId: selectedPart.value.id!,
            description: descriptionValue.value,
            quantity: qtyValue.value
        };

        await fetch(`${apiUrl}/parts_to_vehicle_parts`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}`},
            body: JSON.stringify(newData)
        });

        await onRefresh();

        clearForm();
    }

    const handlers = {
        partFocus() {
            showSelector.value = true;
            partValue.value = "";
        },
        partBlur() {
            showSelector.value = false;
            selectorLoading.value = false;
            selectorItems.value = [];
            if (selectedPart.value) partValue.value = selectedPart.value.name;
            else partValue.value = "";
        },
        partInputChange(value: string) {
            partValue.value = value;
            selectorIndex.value = null;
            selectorLoading.value = true;
            selectorItems.value = [];
        },
        partKeyUp(e) {
            if (e.key === "ArrowUp" || e.key ==="ArrowDown") e.preventDefault();

            if (e.key === "ArrowUp") return moveSelector(-1);
            if (e.key === "ArrowDown") return moveSelector(1);
            if (e.key === "Enter") return selectorSelect();
        },
        partBeginSearching(q: string) {
            partSearchValue.value = q;
        },
        async descriptionKeyDown(e) {
            if (e.key === "Enter") return await createPartToVehiclePart();
        },
        async quantityKeyDown(e) {
            if (e.key === "Enter") return await createPartToVehiclePart();
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col">
                        {
                            showSelector.value
                            ? (
                                <ul style={{ bottom: "60px" }} className="dropdown-menu d-grid gap-1 p-2 rounded-3 mx-0 shadow w-220px">
                                    {
                                        selectorLoading.value
                                        ? (
                                            <li className="px-3 py-1 text-secondary">Loading...</li>
                                        )
                                        : (
                                        <>
                                        {
                                            selectorItemsSliced.value.length > 0
                                            ?
                                            <>
                                            {
                                                selectorItemsSliced.value.map((item, i) =>
                                                    <li>
                                                        <a role="button" className={`dropdown-item rounded-2 ${selectorIndex.value === i ? "active" : ""}`}>{item.name}</a>
                                                    </li>
                                                )
                                            }
                                            </>
                                            : <li className="px-3 py-1 text-secondary">No part found</li>
                                        }
                                        </>
                                        )
                                    }
                                    <li>
                                        <hr className="dropdown-divider m-1" />
                                    </li>
                                    <li>
                                        <a role="button" className={`dropdown-item rounded-2 ${selectorIndex.value === null ? "active" : ""}`}>Create new</a>
                                    </li>
                                </ul>
                            )
                            : null
                        }
                        <DebouncedSearch
                            value={partValue.value}
                            disabled={partCreateLoading.value}
                            onBlur={handlers.partBlur}
                            onFocus={handlers.partFocus}
                            onSearchChange={handlers.partInputChange}
                            onBeginSearching={handlers.partBeginSearching}
                            onLoading={() => selectorLoading.value = true}
                            onKeyUp={handlers.partKeyUp}
                        />
                    </div>
                    <div className="col">
                        <input onKeyUp={handlers.descriptionKeyDown} value={descriptionValue.value} onChange={(e) => descriptionValue.value = e.target.value} ref={descriptionInput} type="text" className="form-control" placeholder="Description" />
                    </div>
                    <div className="col-2">
                        <input
                            value={qtyValue.value}
                            onChange={(e) => qtyValue.value = e.target.value}
                            onKeyUp={handlers.quantityKeyDown}
                            type="text" className="form-control" placeholder="Quantity"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}