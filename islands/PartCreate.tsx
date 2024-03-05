import { useEffect, useState } from "preact/hooks";
import { State } from "../routes/_middleware.ts";
import { SearchList } from "../types/search-list.ts";
import { Part } from "../types/part.ts";
import DebouncedSearch from "../components/DebouncedSearch.tsx";

const partRaw: Part = {
    name: "",
    description: "",
    note: ""
}

export default function PartCreate({
    contextState
}: {
    contextState: State
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
    const [part, setPart] = useState<Part>(Object.assign({}, partRaw));

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

    const handlers = {
        searchChange(q: string) {
            setSearch(prev => ({ ...prev, query: q }));
        },
        async savePart() {
            const res = await fetch(`${apiUrl}/parts`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}`},
                body: JSON.stringify(part)
            })

            clearForm();
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
                    <button onClick={handlers.savePart} type="button" className="btn btn-primary">Save</button>
                </div>
            </div>
            <div className="col">
                {listGenerate()}
            </div>
        </div>
    );
}