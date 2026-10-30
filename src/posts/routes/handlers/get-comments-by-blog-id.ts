import { commentsQueryRepository } from "../../../comments/repository/comment.query.repository";
import { CommentQueryInput } from "../../../comments/routs/input/comment-query.input";
import { RequestWithParamsAndQuery } from "../../../core/types/request_types";
import { postQueryRepository } from "../../repository/post.query.repository";
import { buildCommentPagination } from "../../../comments/routs/output/comment-list-pagination-output";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { Response } from "express";

export async function getCommentsByPodtId(req: RequestWithParamsAndQuery<{id:string}, CommentQueryInput>, res: Response){
    try{
        const blogId = req.params.id;
        await postQueryRepository.findByIdOrFail(blogId)
        const queryInput = req.query;      
        const { mappedComments, totalCount } = await commentsQueryRepository.findMany(queryInput, blogId);      
        
         const response = buildCommentPagination(
                    mappedComments,
                    totalCount,
                    queryInput.pageNumber,
                    queryInput.pageSize
                )
       res.status(HttpStatus.Ok).send(response)
         }catch (e: unknown) {
                 errorsHandler(e, res);
       }
}