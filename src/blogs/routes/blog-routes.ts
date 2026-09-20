import { Router } from "express";
import { BlogViewModel } from "../dto/blog.view.model";
import { BlogInputDto } from "../dto/blog.input.dto";
import { RequestWithParams,RequestWithBody,RequestWithParamsAndBody } from "../../core/types/request_types";
import { Request, Response } from 'express';
import { getBlogViewModel } from "../blog.mapper";
import { HttpStatus } from "../../core/types/http-statuses";
import { blogsRepository } from "../repository/blog.repository";

export const blogsRouter = Router({})

   blogsRouter.get("/", (req: Request, res: Response<BlogViewModel[]>) => {
    res.status(HttpStatus.Ok).send(blogsRepository.getAllBlogs().map(getBlogViewModel));
  });

    blogsRouter.get("/:id", (req: RequestWithParams<{id:string}>, res: Response<BlogViewModel>) => {
      const foundBlog = blogsRepository.getBlogById(req.params.id)
      if (!foundBlog){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.status(HttpStatus.Ok).send(getBlogViewModel(foundBlog));
  });

   blogsRouter.post("/", (req: RequestWithBody<BlogInputDto>, res: Response) => {
    res.status(HttpStatus.Created).send(getBlogViewModel(blogsRepository.createBlog(req.body)))
    });

    blogsRouter.put("/:id", (req: RequestWithParamsAndBody<{id:string},BlogInputDto>,  res: Response) => {
      if (!blogsRepository.updateBlog(req.params.id, req.body)){
        res.sendStatus(HttpStatus.NotFound)
        return
      }else{
      res.sendStatus(HttpStatus.NoContent)}
  });

blogsRouter.delete("/:id", (req: RequestWithParams<{id:string}>, res: Response)=>{
 
  if (!blogsRepository.deleteBlog(req.params.id)){
    res.sendStatus(HttpStatus.NotFound)
    return
  } else{
  res.sendStatus(HttpStatus.NoContent)
  }
})