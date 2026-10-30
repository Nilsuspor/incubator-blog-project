import { Comment } from "../type/comment";
import { WithId } from "mongodb";
import { commentCollection } from "../../db/collections";


export const commentsRepository = {
    async createComment(newComment: Comment):Promise<string>{
        const insertResult = await commentCollection.insertOne(newComment)
        return insertResult.insertedId.toString()
    }
}