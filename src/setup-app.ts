import express, { Express } from "express";
import { Request, Response } from 'express';
import {HttpStatus} from "./core/types/http-statuses";
import { db } from "./db/in_memory.db";
import { Blog } from "./blogs/types/blogs";
import { Post } from "./posts/types/posts";
import { BlogInputDto } from "./blogs/dto/blog.input.dto";
import { PostInputDto } from "./posts/dto/post.input.dto";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "./core/types/request_types";
import { BlogViewModel } from "./blogs/dto/blog.view.model";
import { PostViewModel } from "./posts/dto/post.view.model";
import { getPostViewModel } from "./posts/post.mapper";
import { getBlogViewModel } from "./blogs/blog.mapper";
import { blogsRouter } from "./blogs/routes/blog-routes";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  // основной роут
  app.get("/", (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send("Hello world!");
  });


  app.use('/blogs', blogsRouter)

   app.get("/posts", (req: Request, res: Response<PostViewModel[]>) => {
    res.status(HttpStatus.Ok).send(db.posts.map(getPostViewModel));
  });


  app.get("/posts/:id", (req: RequestWithParams<{id:string}>, res: Response<PostViewModel>) => {
      const foundPost = db.posts.find((p)=>p.id===req.params.id)
      if (!foundPost){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.status(HttpStatus.Ok).send(getPostViewModel(foundPost))
  });

app.post("/posts", (req: RequestWithBody<PostInputDto>, res: Response) => {
    
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

     app.put("/posts/:id", (req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response) => {
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

    app.delete("/posts/:id", (req: RequestWithParams<{id:string}>, res: Response)=>{
  const idToDelete = req.params.id;
  const postIndex = db.posts.findIndex((blog)=>blog.id===idToDelete)

  if (postIndex<0){
    res.sendStatus(HttpStatus.NotFound)
    return
  }

  db.posts.splice(postIndex,1)
  res.sendStatus(HttpStatus.NoContent)
})


  app.delete("/testing/all-data", (req: Request, res: Response) => {
  db.posts = [];
  db.blogs = [];
  res.sendStatus(HttpStatus.NoContent);
});




  return app;

};