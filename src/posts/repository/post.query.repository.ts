import { Post } from "../types/posts";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/collections";
import { PostQueryInput } from "../routes/input/post-query.input";
import { mapToPostViewModel } from "../routes/mappers/map-to post-view-model.util";
import { PostViewModel } from "../dto/post.view.model";

export const postQueryRepository = {
     
    
    async findMany(queryDto: PostQueryInput, blogId?: string): Promise<{mappedPosts:PostViewModel[]; totalCount:number}>{
       const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
     } = queryDto
     const filter: any = {};
        if (blogId) {
            filter.blogId = blogId; 
        }

     const skip = (pageNumber - 1) * pageSize;
     
     
     const items = await postCollection
          .find(filter)
          .sort({[sortBy]:sortDirection})
          .skip(skip)
          .limit(pageSize)
          .toArray();

    const mappedPosts = items.map(post => mapToPostViewModel(post))
    const totalCount = await postCollection.countDocuments(filter)
         return { mappedPosts, totalCount };   
        
    },

    async getPostById(id : string): Promise<PostViewModel|null>{
      const foundPost = await postCollection.findOne({_id:new ObjectId(id)})
      if (!foundPost) {
         return null
      }
       return mapToPostViewModel(foundPost)
    },
}