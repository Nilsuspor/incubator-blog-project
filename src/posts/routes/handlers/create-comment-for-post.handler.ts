import { Response } from "express";
import { CommentInputDto } from "../../../comments/dto/comment.input.dto";
import { RequestWithParamsAndBodyAndUserId } from "../../../core/types/request_types";
import { IdType } from "../../../core/types/id";
import { CommentViewModel } from "../../../comments/dto/comment.view.model";
import { commentsServices } from "../../../comments/application/comment.servise";


export async function createCommentForPostHandler(req:RequestWithParamsAndBodyAndUserId<{ id: string }, CommentInputDto, IdType>,
    res: Response<CommentViewModel>
) {
    const postId = req.params.id;         
    const content = req.body.content;     
    const userId = req.user.id;

    const newComment = await commentsServices.createComment(postId, content, userId)

    return
    
}