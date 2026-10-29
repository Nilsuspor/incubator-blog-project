import { Comment } from "../type/comment";
import { WithId } from "mongodb";
import { commentCollection } from "../../db/collections";


export const commentsRepository = {
    async createComment(newComment: Comment):Promise<WithId<Comment>>{
        const insertResult = await commentCollection.insertOne(newComment)
        return {...newComment, _id:insertResult.insertedId}
    }
}