import { db } from "../../db/in_memory.db";
import { Blog } from "../types/blogs";
import { BlogInputDto } from "../dto/blog.input.dto";

import { blogCollection } from "../../db/collections";
import { WithId } from "mongodb";

export const blogsRepository = {
     async FindAllBlogs(): Promise<WithId<Blog>[]>{
        return blogCollection.find().toArray()
    },
    
    async getBlogById(id : string): Promise<WithId<Blog>|null>{
       return blogCollection.findOne({_id:new Object(id)})
    },

    async createBlog(newBlog : Blog): Promise<WithId<Blog>>{
       const insertResult = await blogCollection.insertOne(newBlog)
    return {...newBlog, _id:insertResult.insertedId}
    },



     async updateBlog (id : string, blog: Omit<Blog, 'createdAt'|'isMembership'>):Promise<boolean>{
        const updatedResult = await blogCollection.updateOne(
          {_id: new Object(id)},
          {$set: blog}
        )
            return true
        
    },

    async deleteBlog(id:string):Promise<boolean>{
      const deleteResult = await blogCollection.deleteOne({
        _id: new Object(id)
      })

      return deleteResult.deletedCount>0
    }


}