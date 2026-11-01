import { Comment } from "../type/comment";
import { ObjectId, WithId } from "mongodb";
import { commentCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const commentsRepository = {
    async createComment(newComment: Comment):Promise<string>{
        const insertResult = await commentCollection.insertOne(newComment)
        return insertResult.insertedId.toString()
    },

    async deleteOne(id:string):Promise<boolean>{
        const deleteResult = await commentCollection.deleteOne({
            _id: new ObjectId(id),
        }) 
        return deleteResult.deletedCount > 0;
    },

    async updateOne(id:string, content:string):Promise<boolean>{
        const updateResult = await commentCollection.updateOne(
            {_id:new ObjectId(id)},
            { $set: { content: content } }
        )
        return updateResult.matchedCount>0
    },

     async findByIdOrFail(id: string):Promise<WithId<Comment>>{
            const foundComment = await commentCollection.findOne({_id:new ObjectId(id)})
            if (!foundComment){
                throw new NotFoundException('Comment not found');
            }
            return foundComment
        },
}