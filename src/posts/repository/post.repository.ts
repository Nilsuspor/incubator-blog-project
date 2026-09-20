import { db } from "../../db/in_memory.db";
import { Post } from "../types/posts";
import { PostInputDto } from "../dto/post.input.dto";
import { create } from "node:domain";


export const postRepository = {
     getAllPosts(): Post[]{
        return db.posts
    },

    getPostById(id : string): Post|undefined{
       return db.posts.find((b)=>b.id===id)
    },

    createPost(body :PostInputDto):Post|null{
            const lastPost = db.posts[db.posts.length - 1];
             const foundBlog = (db.blogs.find((b)=>b.id===body.blogId))
             
              if(!foundBlog){
               
                return null
              }
              const newPost: Post ={
              id:lastPost ? (+lastPost.id + 1).toString() : "1",
              title:body.title,
              shortDescription:body.shortDescription,
              content:body.content,
              blogId:body.blogId,
             
              blogName:foundBlog.name
            }
            db.posts.push(newPost)
        
        return newPost
    },

    updatePost(id:string, body:PostInputDto): boolean{
         const foundPost = db.posts.find((b)=>b.id===id) 
        if (!foundPost){
            return false
        }
        const foundBlog = (db.blogs.find((b)=>b.id===body.blogId)) 
        if (!foundBlog){
            return false
        }
        else {
        foundPost.title = body.title
        foundPost.shortDescription = body.shortDescription
        foundPost.content =body.content
        foundPost.blogId =body.blogId
        foundPost.blogName = foundBlog.name
            return true
        }
    },

    deletePost(id:string):boolean{
        const idToDelete = id;
        const postIndex = db.posts.findIndex((post)=>post.id===idToDelete)

        if (postIndex<0){
        return false
        }
        db.posts.splice(postIndex,1)
        return true
}

}