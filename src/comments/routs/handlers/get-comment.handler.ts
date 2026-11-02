import { RequestWithParams } from "../../../core/types/request_types";
import { CommentViewModel } from "../../dto/comment.view.model";
import { Response } from 'express';
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { commentsQueryRepository } from "../../repository/comment.query.repository";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function getCommentHandler(
    req: RequestWithParams<{id:string}>,
    res: Response<CommentViewModel>
){
    try{
        const foundComment = await commentsQueryRepository.findById(req.params.id)
        res.status(HttpStatus.Ok).send(foundComment)
    }catch (e: unknown) {
        errorsHandler(e, res);
      }
}