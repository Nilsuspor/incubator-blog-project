import { Router } from "express";
import { BlogViewModel } from "../dto/blog.view.model";
import { BlogInputDto } from "../dto/blog.input.dto";
import { RequestWithParams,RequestWithBody,RequestWithParamsAndBody } from "../../core/types/request_types";
import { Request, Response } from 'express';
import { Blog } from "../types/blogs";
import { db } from "../../db/in_memory.db";
import { getBlogViewModel } from "../blog.mapper";
import { HttpStatus } from "../../core/types/http-statuses";


export const blogsRouter = Router({})

   blogsRouter.get("/", (req: Request, res: Response<BlogViewModel[]>) => {
    res.status(HttpStatus.Ok).send(db.blogs.map(getBlogViewModel));
  });

    blogsRouter.get("/:id", (req: RequestWithParams<{id:string}>, res: Response<BlogViewModel>) => {
      const foundBlog = db.blogs.find((b)=>b.id===req.params.id)

      if (!foundBlog){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.status(HttpStatus.Ok).send(getBlogViewModel(foundBlog));

  });

   blogsRouter.post("/", (req: RequestWithBody<BlogInputDto>, res: Response) => {
    
     const lastBlog = db.blogs[db.blogs.length -1]
    const newBlog: Blog ={
      id:lastBlog?((+lastBlog.id+1).toString()):'1',
      name:req.body.name,
      description:req.body.description,
      websiteUrl:req.body.websiteUrl
    }

   db.blogs.push(newBlog)
    res.status(HttpStatus.Created).send(getBlogViewModel(newBlog))

    });

    blogsRouter.put("/:id", (req: RequestWithParamsAndBody<{id:string},BlogInputDto>,  res: Response) => {
      const blog = db.blogs.find((b)=>b.id===req.params.id)

      if (!blog){
        res.sendStatus(HttpStatus.NotFound)
        return
      }

      blog.name = req.body.name
      blog.description = req.body.description
      blog.websiteUrl = req.body.websiteUrl


      res.sendStatus(HttpStatus.NoContent)
  });

    blogsRouter.delete("/:id", (req: RequestWithParams<{id:string}>, res: Response)=>{
  const idToDelete = req.params.id;
  const blogIndex = db.blogs.findIndex((blog)=>blog.id===idToDelete)

  if (blogIndex<0){
    res.sendStatus(HttpStatus.NotFound)
    return
  }

  db.blogs.splice(blogIndex,1)
  res.sendStatus(HttpStatus.NoContent)
})