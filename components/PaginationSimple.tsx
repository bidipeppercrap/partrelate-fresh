import { Pagination } from "../types/pagination.ts";

export default function PaginationSimple({
    pagination,
    onPageChange
}: {
    pagination: Pagination,
    onPageChange: (step: number) => void
}) {
    const { currentPage, totalPages } = pagination;
    
    return (
        <div className="d-flex justify-content-between align-items-center">
            <div></div>
            <div className="btn-group">
                <button onClick={() => onPageChange(-1)} type="button" className="btn btn-outline-secondary" disabled={currentPage === 1}><i className="bi-chevron-left"></i></button>
                <button onClick={() => onPageChange(+1)} type="button" className="btn btn-outline-secondary" disabled={currentPage >= totalPages}><i className="bi-chevron-right"></i></button>
            </div>
            <div className="text-secondary">Page {currentPage} / {totalPages}</div>
        </div>
    );
}