import { useEffect, useState } from "preact/hooks";
import { State } from "../routes/_middleware.ts";
import { Pagination } from "../types/pagination.ts";
import { Search } from "../types/search.ts";
import PaginationSimple from "../components/PaginationSimple.tsx";
import DebouncedSearch from "../components/DebouncedSearch.tsx";

export default function PartSearch({
    contextState
}: {
    contextState: State
}) {
    const { apiUrl, token } = contextState;
    const [search, setSearch] = useState<Search>({ loading: false, query: "" });
    const [pagination, setPagination] = useState<Pagination>({
        currentPage: 1,
        totalPages: 1
    });

    const [parts, setParts] = useState([]);

    useEffect(() => {
        const beginSearching = async () => await searchPart(search.query, pagination.currentPage);
        beginSearching();
    }, [search.query, pagination.currentPage]);

    async function searchPart(q: string, page: number) {
        setSearch(prev => ({ ...prev, loading: true }));
        const res = await fetch(`${apiUrl}/parts?keyword=${q}&page=${page}`, {
            headers: { "Authorization": `Bearer ${token}`}
        })

        const jsonData = await res.json();

        setParts(jsonData.data);
        setPagination(prev => ({ ...prev, totalPages: jsonData.totalPages || 1 }));
        setSearch(prev => ({ ...prev, loading: false }));
    }

    const handlers = {
        searchChange(q: string) {
            setSearch(prev => ({ ...prev, query: q }));
            setPagination(prev => ({ ...prev, currentPage: 1 }));
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-auto">
                    <DebouncedSearch onLoading={() => setSearch(prev => ({ ...prev, loading: true }))} onBeginSearching={handlers.searchChange} />
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-primary"><i className="bi-plus"></i></button>
                </div>
            </div>
            <div className="mt-3">
                {
                    search.loading ? <h3 className="text-secondary text-center">Loading...</h3> : null
                }
                {
                    !search.loading && parts.length < 1 ? <h3 className="text-secondary text-center">No part found</h3> : null
                }
                {
                    !search.loading && parts.length > 0
                    ? (
                        <div className="list-group">
                            {
                                parts.map(part =>
                                    <a key={part.id} href="#" className="list-group-item list-group-item-action">{part.name}</a>
                                )
                            }
                        </div>
                    )
                    : null
                }
            </div>
            <div className="mt-3">
                <PaginationSimple onPageChange={(step) => setPagination(prev => ({...prev, currentPage: prev.currentPage + step}))} pagination={pagination} />
            </div>
        </>
    );
}