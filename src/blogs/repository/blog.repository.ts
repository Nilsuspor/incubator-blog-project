
import { Blog } from "../types/blogs";
import { blogCollection } from "../../db/collections";
import { ObjectId, WithId } from "mongodb";
import { BlogQueryInput } from "../routes/input/blog-query.input";


export const blogsRepository = {
     
    async createBlog(newBlog : Blog): Promise<WithId<Blog>>{
       const insertResult = await blogCollection.insertOne(newBlog)
    return {...newBlog, _id:insertResult.insertedId}
    },

     async updateBlog (id : string, blog: Omit<Blog, 'createdAt'|'isMembership'>):Promise<boolean>{
        const updateResult = await blogCollection.updateOne(
          {_id: new ObjectId(id)},
          {$set: blog}
        )
            return updateResult.matchedCount > 0;
        
    },

    async deleteBlog(id:string):Promise<boolean>{
      const deleteResult = await blogCollection.deleteOne({
        _id: new ObjectId(id)
      })

      return deleteResult.deletedCount>0
    }


}