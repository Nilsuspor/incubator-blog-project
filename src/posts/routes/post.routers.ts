import { Router } from "express";
import { PostViewModel } from "../dto/post.view.model";
import { PostInputDto } from "../dto/post.input.dto";
import { RequestWithParams,RequestWithBody,RequestWithParamsAndBody } from "../../core/types/request_types";
import { Request, Response } from 'express';
import { Post } from "../types/posts";
import { db } from "../../db/in_memory.db";
import { getPostViewModel } from "../post.mapper";
import { HttpStatus } from "../../core/types/http-statuses";
import { postRepository } from "../repository/post.repository";

export const postsRouter = Router({})

 postsRouter.get("/", (req: Request, res: Response<PostViewModel[]>) => {
    res.status(HttpStatus.Ok).send(postRepository.getAllPosts().map(getPostViewModel));
  });

  postsRouter.get("/:id", (req: RequestWithParams<{id:string}>, res: Response<PostViewModel>) => {
      const foundPost = postRepository.getPostById(req.params.id)
      if (!foundPost){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.status(HttpStatus.Ok).send(getPostViewModel(foundPost))
  });

postsRouter.post("/", (req: RequestWithBody<PostInputDto>, res: Response) => {
    const newPost = postRepository.createPost(req.body)
      if(newPost===null){
        res.sendStatus(HttpStatus.BadRequest)
        return
      }else{
    res.status(HttpStatus.Created).send(getPostViewModel(newPost))
      }
    });

     postsRouter.put("/:id", (req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response) => {
       if (!postRepository.updatePost(req.params.id, req.body)){
              res.sendStatus(HttpStatus.NotFound)
              return
            }else{
            res.sendStatus(HttpStatus.NoContent)}
  });

    postsRouter.delete("/:id", (req: RequestWithParams<{id:string}>, res: Response)=>{
    const idToDelete = req.params.id;
    const postIndex = db.posts.findIndex((blog)=>blog.id===idToDelete)

    if (postRepository.deletePost(req.params.id)){
        res.sendStatus(HttpStatus.NotFound)
    return
    }

    db.posts.splice(postIndex,1)
    res.sendStatus(HttpStatus.NoContent)
})