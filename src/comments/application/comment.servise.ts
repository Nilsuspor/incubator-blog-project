import { ForbiddenException } from "../../core/exceptions/forbidden-exeption";
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
        await PostServices.findById(postId)
        
        const mappedtoBdModelComment = mapCommentInputDtoToComment(content, currentUser, postId)
        const createdCommentId = await commentsRepository.createComment(mappedtoBdModelComment)

        return createdCommentId
    },

    async updateOne(commentId:string, content:string, userId: string):Promise<void>{
        const comment = await commentsRepository.findByIdOrFail(commentId);
        if (comment.commentatorInfo.userId !== userId) {
            throw new ForbiddenException('You can update only your comments')
        }
        await commentsRepository.updateOne(commentId, content)

        

    },

    async deleteOne(commentId: string, userId: string): Promise<void> {
        const comment = await commentsRepository.findByIdOrFail(commentId);
        if (comment.commentatorInfo.userId !== userId) {
            throw new ForbiddenException('You can delete only your comments')
        }
            await commentsRepository.deleteOne(commentId);
                
             },
}