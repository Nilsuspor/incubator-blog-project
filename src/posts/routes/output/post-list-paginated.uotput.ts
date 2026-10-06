import { Post } from "../../types/posts";

export function buildPostPagination(
    items: Post[],
    totalCount: number,
    pageNumber: number,
    pageSize: number
){
    return{
    pagesCount: Math.ceil(totalCount / pageSize), 
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items
    }
}