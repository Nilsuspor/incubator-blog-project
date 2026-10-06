
import { Post } from "../types/posts";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/collections";
import { PostQueryInput } from "../routes/input/post-query.input";

export const postRepository = {
     
    
    async findMany(queryDto: PostQueryInput, blogId?: string): Promise<{items:WithId<Post>[]; totalCount:number}>{
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
          .find({})
          .sort({[sortBy]:sortDirection})
          .skip(skip)
          .limit(pageSize)
          .toArray();

       
    const totalCount = await postCollection.countDocuments({})
         return { items, totalCount };   
        
    },

    async getPostById(id : string): Promise<WithId<Post>|null>{
       return postCollection.findOne({_id:new ObjectId(id)})
    },

    async createPost(newPost :Post):Promise<WithId<Post>>{
         const insertResult = await postCollection.insertOne(newPost)
         return {...newPost, _id:insertResult.insertedId}

    },

   async updatePost(id:string, post:Omit<Post,'createdAt'>):Promise< boolean>{
        const updateResult = await postCollection.updateOne(
            {_id:new ObjectId(id)},
            {$set:post}
        )
        return updateResult.matchedCount>0
    },

     async deletePost(id: string): Promise<boolean> {
  const deleteResult = await postCollection.deleteOne({
    _id: new ObjectId(id),
  });

  return deleteResult.deletedCount > 0;
},

   async deletePostsByBlogId(blogId: string) {
    await postCollection.deleteMany({blogId})
    
    return 
    }

}