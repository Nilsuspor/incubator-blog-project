import { Response } from "express";
import { CommentInputDto } from "../../../comments/dto/comment.input.dto";
import { RequsetWithParamsAndBodyAndUserId } from "../../../core/types/request_types";
import { IdType } from "../../../core/types/id";
import { CommentViewModel } from "../../../comments/dto/comment.view.model";
import { commentsServices } from "../../../comments/application/comment.servise";
import { commentsQueryRepository } from "../../../comments/repository/comment.query.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function createCommentForPostHandler(req:RequsetWithParamsAndBodyAndUserId<{ id: string }, CommentInputDto, IdType>,
    res: Response<CommentViewModel>
) {
    try{
    const postId = req.params.id;         
    const content = req.body.content;
    if (!req.user) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }
    const userId = req.user.id;

   const newCommentId = await commentsServices.createComment(postId, content, userId)
   const newComment = await commentsQueryRepository.findById(newCommentId) 
   if (!newComment) {
        
        res.sendStatus(HttpStatus.NotFound)
        return; 
    }
    res.status(HttpStatus.Created).send(newComment)
} catch (e: unknown) {
        errorsHandler(e, res);
    }
}