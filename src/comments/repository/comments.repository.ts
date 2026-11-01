import { Comment } from "../type/comment";
import { ObjectId } from "mongodb";
import { commentCollection } from "../../db/collections";

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
    }
}