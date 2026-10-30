import { CommentQueryInput } from "../../../comments/routes/input/comment-querry.input";
import { RequestWithParamsAndQuery } from "../../../core/types/request_types";
import { Response } from "express";
import { postQueryRepository } from "../../repository/post.query.repository";
import { commentsQueryRepository } from "../../../comments/repository/comment.query.repository";
import { buildCommentPagination } from "../../../comments/routes/output/buildCommentPagination";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function getCommentsByBlogId(req: RequestWithParamsAndQuery<{postId:string}, CommentQueryInput>,res: Response){
    try {
        const postId = req.params.postId
        await postQueryRepository.findByIdOrFail(postId)
        const queryInput = req.query
        const {mappedComments, totalCount} = await commentsQueryRepository.findMany(queryInput,postId)

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