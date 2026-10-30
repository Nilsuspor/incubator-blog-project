import { commentCollection } from "../../db/collections";
import { CommentViewModel } from "../dto/comment.view.model";
import { ObjectId } from "mongodb";
import { mapToCommentViewModel } from "../utils/mappers/map-comment-to-view-model";


export const commentsQueryRepository = {
    async findById(id: string):Promise<CommentViewModel|null>{
        const foundComment = await commentCollection.findOne({_id:new ObjectId(id)})
        if (!foundComment){
            return null
        }
        return mapToCommentViewModel(foundComment)
    }
}