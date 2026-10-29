
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { userServices } from "../../users/application/user.service";
import { CommentViewModel } from "../dto/comment.view.model";
import { commentsRepository } from "../repository/comments.repository";
import { mapCommentInputDtoToComment } from "../utils/mappers/map-comment-input-dto-tocomment.util";
import { mapToCommentViewModel } from "../utils/mappers/map-comment-to-view-model";

export const commentsServices = {
    async createComment(postId: string, content:string, userId: string):Promise<CommentViewModel>{
        const currentUser = await userServices.findByid(userId)
        if (!currentUser){
            throw new NotFoundException('User not found')
        }
        
        const mappedtoBdModelComment = mapCommentInputDtoToComment(content, currentUser, postId)
        const createdComent = await commentsRepository.createComment(mappedtoBdModelComment)

        return mapToCommentViewModel(createdComent)
    }
}