import { db } from "../../db/in_memory.db";
import { Blog } from "../types/blogs";
import { BlogInputDto } from "../dto/blog.input.dto";

import { blogCollection } from "../../db/collections";
import { WithId } from "mongodb";

export const blogsRepository = {
     async FindAllBlogs(): Promise<WithId<Blog>[]>{
        return blogCollection.find().toArray()
    },
    
    getBlogById(id : string): Blog|undefined{
       return db.blogs.find((b)=>b.id===id)
    },

    createBlog(body : BlogInputDto): Blog{
        const lastBlog = db.blogs[db.blogs.length -1]
        const newBlog: Blog ={
      id:lastBlog?((+lastBlog.id+1).toString()):'1',
      name:body.name,
      description:body.description,
      websiteUrl:body.websiteUrl
    }
    db.blogs.push(newBlog)
    return newBlog
    },

    updateBlog (id : string, body: BlogInputDto):boolean{
       const foundBlog = db.blogs.find((b)=>b.id===id)
        if (!foundBlog){
            return false
            }
            foundBlog.name =body.name
            foundBlog.description = body.description
            foundBlog.websiteUrl = body.websiteUrl
            return true
        
    },

    deleteBlog(id:string):boolean{
        const idToDelete = id;
          const blogIndex = db.blogs.findIndex((blog)=>blog.id===idToDelete)
        
          if (blogIndex<0){
            return false
          }        
          db.blogs.splice(blogIndex,1)
          return true
    }


}