import { CommentViewModel } from "../../dto/comment.view.model"

export function buildCommentPagination(
    items: CommentViewModel[],
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