
import { Post } from "../types/posts";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/collections";
import { mapToPostViewModel } from "../routes/mappers/map-to post-view-model.util";

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