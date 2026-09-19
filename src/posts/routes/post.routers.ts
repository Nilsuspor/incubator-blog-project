import { Router } from "express";
import { PostViewModel } from "../dto/post.view.model";
import { PostInputDto } from "../dto/post.input.dto";
import { RequestWithParams,RequestWithBody,RequestWithParamsAndBody } from "../../core/types/request_types";
import { Request, Response } from 'express';
import { Post } from "../types/posts";
import { db } from "../../db/in_memory.db";
import { getPostViewModel } from "../post.mapper";
import { HttpStatus } from "../../core/types/http-statuses";


export const postsRouter = Router({})

 postsRouter.get("/", (req: Request, res: Response<PostViewModel[]>) => {
    res.status(HttpStatus.Ok).send(db.posts.map(getPostViewModel));
  });

  postsRouter.get("/:id", (req: RequestWithParams<{id:string}>, res: Response<PostViewModel>) => {
      const foundPost = db.posts.find((p)=>p.id===req.params.id)
      if (!foundPost){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.status(HttpStatus.Ok).send(getPostViewModel(foundPost))
  });

postsRouter.post("/", (req: RequestWithBody<PostInputDto>, res: Response) => {
    
     const lastPost = db.posts[db.posts.length - 1];
     const foundBlog = (db.blogs.find((b)=>b.id===req.body.blogId))
     
      if(!foundBlog){
        res.sendStatus(HttpStatus.BadRequest)
        return
      }
      const newPost: Post ={
      id:lastPost ? (+lastPost.id + 1).toString() : "1",
      title:req.body.title,
      shortDescription:req.body.shortDescription,
      content:req.body.content,
      blogId:req.body.blogId,
     
      blogName:foundBlog.name
    }
    db.posts.push(newPost)
    res.status(HttpStatus.Created).send(getPostViewModel(newPost))

    });

     postsRouter.put("/:id", (req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response) => {
      const foundBlog = (db.blogs.find((b)=>b.id===req.body.blogId))
      const post = db.posts.find((p)=>p.id===req.params.id)

      if (!post){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      if(!foundBlog){
        res.sendStatus(HttpStatus.BadRequest)
        return
      }

      post.title = req.body.title
      post.shortDescription = req.body.shortDescription
      post.content =req.body.content
      post.blogId =req.body.blogId
      post.blogName = foundBlog.name

      res.sendStatus(HttpStatus.NoContent)
  });

    postsRouter.delete("/:id", (req: RequestWithParams<{id:string}>, res: Response)=>{
  const idToDelete = req.params.id;
  const postIndex = db.posts.findIndex((blog)=>blog.id===idToDelete)

  if (postIndex<0){
    res.sendStatus(HttpStatus.NotFound)
    return
  }

  db.posts.splice(postIndex,1)
  res.sendStatus(HttpStatus.NoContent)
})