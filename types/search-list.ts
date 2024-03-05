import { Pagination } from "./pagination.ts";

export interface SearchList<T> {
    loading: boolean,
    query: string,
    pagination: Pagination,
    list: T[]
}