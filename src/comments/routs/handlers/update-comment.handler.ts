import { IdType } from "../../../core/types/id";
import { RequsetWithParamsAndBodyAndUserId } from "../../../core/types/request_types";
import { CommentInputDto } from "../../dto/comment.input.dto";
import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { commentsServices } from "../../application/comment.servise";

export async function updateCommentHandler(req:RequsetWithParamsAndBodyAndUserId<{commentId:string}, CommentInputDto, IdType>, res: Response) {
   try{
    const commentId = req.params.commentId
    const content = req.body.content
    if (!req.user) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
    }        
    const userId = req.user.id
    await commentsServices.updateOne(commentId, content, userId)
     res.sendStatus(HttpStatus.NoContent);
   }catch (e: unknown) {
           errorsHandler(e, res);
       }

}