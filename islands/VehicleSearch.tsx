import { useEffect, useState } from "preact/hooks";
import DebouncedSearch from "../components/DebouncedSearch.tsx";
import { State } from "../routes/_middleware.ts";
import PaginationSimple from "../components/PaginationSimple.tsx";
import { SearchList } from "../types/search-list.ts";
import { Vehicle } from "../types/vehicle.ts";

export default function VehicleSearch({
    contextState
}: {
    contextState: State
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

    useEffect(() => {
        const beginSearching = async () => await searchVehicle(search.query, search.pagination.currentPage);
        beginSearching();
    }, [search.query, search.pagination.currentPage]);

    async function searchVehicle(q: string, page: number) {
        setSearch(prev => ({ ...prev, loading: true }));
        const res = await fetch(`${apiUrl}/vehicles?keyword=${q}&page=${page}`, {
            headers: { "Authorization": `Bearer ${token}`}
        })

        const jsonData = await res.json();

        setSearch(prev => ({
            ...prev,
            loading: false,
            pagination: { ...prev.pagination, totalPages: jsonData.totalPages },
            list: jsonData.data
        }));
    }

    const handlers = {
        searchChange(q: string) {
            setSearch(prev => ({ ...prev, query: q, pagination: { ...prev.pagination, currentPage: 1 } }));
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-auto">
                    <DebouncedSearch onLoading={() => setSearch(prev => ({ ...prev, loading: true }))} onBeginSearching={handlers.searchChange} />
                </div>
                <div className="col-auto">
                    <a href="/vehicle/create" role="button" className="btn btn-primary"><i className="bi-plus"></i></a>
                </div>
            </div>
            <div className="mt-3">
                {
                    search.loading ? <h3 className="text-secondary text-center">Loading...</h3> : null
                }
                {
                    !search.loading && search.list.length < 1 ? <h3 className="text-secondary text-center">No vehicle found</h3> : null
                }
                {
                    !search.loading && search.list.length > 0
                    ? (
                        <div className="list-group">
                            {
                                search.list.map(vehicle =>
                                    <a key={vehicle.id} href={`/vehicle/${vehicle.id}`} className="list-group-item list-group-item-action">{vehicle.name}</a>
                                )
                            }
                        </div>
                    )
                    : null
                }
            </div>
            <div className="mt-3">
                <PaginationSimple onPageChange={(step) => setSearch(prev => ({ ...prev, pagination: { ...prev.pagination, currentPage: prev.pagination.currentPage + step } }))} pagination={search.pagination} />
            </div>
        </>
    );
}