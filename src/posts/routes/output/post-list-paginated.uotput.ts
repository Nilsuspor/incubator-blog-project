import { PostViewModel } from "../../dto/post.view.model";

export function buildPostPagination(
    items: PostViewModel[],
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