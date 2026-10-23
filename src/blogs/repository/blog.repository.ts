
import { Blog } from "../types/blogs";
import { blogCollection } from "../../db/collections";
import { ObjectId, WithId } from "mongodb";
import { NotFoundException } from "../../core/exceptions/not-found.exception";


export const blogsRepository = {
     
    async createBlog(newBlog : Blog): Promise<WithId<Blog>>{
       const insertResult = await blogCollection.insertOne(newBlog)
    return {...newBlog, _id:insertResult.insertedId}
    },

     async updateBlog (id : string, blog: Omit<Blog, 'createdAt'|'isMembership'>):Promise<void>{
        const updateResult = await blogCollection.updateOne(
          {_id: new ObjectId(id)},
          {$set: blog}
        )
         if (updateResult.matchedCount < 1) {
        throw new NotFoundException('Blog not found');
    }
        
    },

    async deleteBlog(id:string):Promise<void>{
      const deleteResult = await blogCollection.deleteOne({
        _id: new ObjectId(id)
      })

      if (deleteResult.deletedCount < 1) {
        throw new NotFoundException('Blog not found');
    }
    },

    async findById(id: string): Promise<Blog|null> {
    const foundBlog = await blogCollection.findOne({ _id: new ObjectId(id) });
    return foundBlog; 
  }

}