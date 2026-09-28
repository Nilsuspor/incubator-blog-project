
import { Post } from "../types/posts";
import { ObjectId, WithId } from "mongodb";
import { postCollection } from "../../db/collections";

export const postRepository = {
     
    
    async getAllPosts(): Promise<WithId<Post>[]>{
        return postCollection.find().toArray()
    },

    async getPostById(id : string): Promise<WithId<Post>|null>{
       return postCollection.findOne({_id:new ObjectId(id)})
    },

    async createPost(newPost :Post):Promise<WithId<Post>>{
         const inertResult = await postCollection.insertOne(newPost)
         return {...newPost, _id:inertResult.insertedId}

    },

   async updatePost(id:string, post:Omit<Post,'createdAt'|'blogName'>):Promise< boolean>{
        const updateResult = await postCollection.updateOne(
            {_id:new ObjectId(id)},
            {$set:post}
        )
        return updateResult.matchedCount>0
    },

     async deletePost(id:string):Promise<boolean>{
        const deleteResult = await postCollection.deleteOne({
            _id: new ObjectId(id)})
        return deleteResult.deletedCount>0
    },

   async deletePostsByBlogId(blogId: string) {
    await postCollection.deleteMany({blogId})
    
    return 
    }

}