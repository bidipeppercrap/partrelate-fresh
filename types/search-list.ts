import { Pagination } from "./pagination.ts";

export interface SearchList {
    loading: boolean,
    query: string,
    pagination: Pagination,
    list: []
}