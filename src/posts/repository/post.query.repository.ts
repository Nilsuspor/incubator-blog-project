import { Post } from "../types/posts";
import { ObjectId, Filter } from "mongodb";
import { postCollection } from "../../db/collections";
import { PostQueryInput } from "../routes/input/post-query.input";
import { mapToPostViewModel } from "../utils/mappers/map-to post-view-model.util";
import { PostViewModel } from "../dto/post.view.model";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const postQueryRepository = {
     
    
    async findMany(queryDto: PostQueryInput, blogId?: string): Promise<{mappedPosts:PostViewModel[]; totalCount:number}>{
       const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
     } = queryDto
     const filter: Filter<Post> = {};
        if (blogId) {
            filter.blogId = blogId; 
        }

     const skip = (pageNumber - 1) * pageSize;
     
     
      const [items, totalCount] = await Promise.all([
                 postCollection.find(filter)
                 .sort({[sortBy]: sortDirection})
                 .skip(skip).limit(pageSize)
                 .toArray(), 
                 postCollection.countDocuments(filter)
             ] );

    const mappedPosts = items.map(post => mapToPostViewModel(post))
         return { mappedPosts, totalCount };   
        
    },

    async findById(id : string): Promise<PostViewModel|null>{
      const foundPost = await postCollection.findOne({_id:new ObjectId(id)})
      if (!foundPost) {
         return null
      }
       return mapToPostViewModel(foundPost)
    },

    async findByIdOrFail(id: string): Promise<PostViewModel> {
              const foundPost = await this.findById(id);
    
              if (!foundPost) {
                throw new NotFoundException('Blog not found');
            }
    
              return foundPost;
            }
}