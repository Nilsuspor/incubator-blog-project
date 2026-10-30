
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { PostServices } from "../../posts/application/post.servise";
import { userServices } from "../../users/application/user.service";
import { commentsRepository } from "../repository/comments.repository";
import { mapCommentInputDtoToComment } from "../utils/mappers/map-comment-input-dto-tocomment.util";

export const commentsServices = {
    async createComment(postId: string, content:string, userId: string):Promise<string>{
        const currentUser = await userServices.findByid(userId)
        if (!currentUser){
            throw new NotFoundException('User not found')
        }
        const post = await PostServices.findById(postId)
        
        const mappedtoBdModelComment = mapCommentInputDtoToComment(content, currentUser, postId)
        const commentId = await commentsRepository.createComment(mappedtoBdModelComment)

        return commentId
    }
}