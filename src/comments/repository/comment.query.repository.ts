import { commentCollection } from "../../db/collections";
import { CommentViewModel } from "../dto/comment.view.model";
import { ObjectId, Filter } from "mongodb";
import { mapToCommentViewModel } from "../utils/mappers/map-comment-to-view-model";
import { CommentQueryInput } from "../routs/input/comment-query.input";
import { Comment } from "../type/comment";
import { NotFoundException } from "../../core/exceptions/not-found.exception";


export const commentsQueryRepository = {
    async findById(id: string):Promise<CommentViewModel|null>{
        const foundComment = await commentCollection.findOne({_id:new ObjectId(id)})
        if (!foundComment){
            return null
        }
        return mapToCommentViewModel(foundComment)
    },

    async findMany(queryDto: CommentQueryInput, postId: string): Promise<{mappedComments:CommentViewModel[]; totalCount:number}>{
           const {
          pageNumber,
          pageSize,
          sortBy,
          sortDirection,
         } = queryDto
         const filter: Filter<Comment> = {'postId':postId};
        
    
         const skip = (pageNumber - 1) * pageSize;
         
         
          const [items, totalCount] = await Promise.all([
                     commentCollection.find(filter)
                     .sort({[sortBy]: sortDirection})
                     .skip(skip).limit(pageSize)
                     .toArray(), 
                     commentCollection.countDocuments(filter)
                 ] );
    
        const mappedComments = items.map(comment => mapToCommentViewModel(comment))
             return { mappedComments, totalCount };   
            
        },

    async findByIdOrFail(id:string): Promise<CommentViewModel>{
        const foundComment = await this.findById(id);

        if (!foundComment){
            throw new NotFoundException('Comment not found')
        }
        return foundComment
    }    


}