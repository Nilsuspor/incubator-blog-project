
import { Post } from "../types/posts";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";

export const postRepository = {
    async createPost(newPost: Post): Promise<string> {
        const insertResult = await postCollection.insertOne(newPost);
        return insertResult.insertedId.toString();

    },

   async updatePost(id:string, post:Omit<Post,'createdAt'>):Promise< boolean>{
        const updateResult = await postCollection.updateOne(
            {_id:new ObjectId(id)},
            {$set:post}
        )
        return updateResult.matchedCount>0
    },

     async deletePost(id: string): Promise<void> {
  const deleteResult = await postCollection.deleteOne({
    _id: new ObjectId(id),
  });
 if (deleteResult.deletedCount < 1) {
               throw new NotFoundException('Post not found');
           }
},

   async deletePostsByBlogId(blogId: string) {
    await postCollection.deleteMany({blogId})
    
    return 
    }, 

     async findById(id : string): Promise<WithId<Post>|null>{
          const foundPost = await postCollection.findOne({_id:new ObjectId(id)})
          if (!foundPost) {
             return null
          }
           return (foundPost)
        },

    

}