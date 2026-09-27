import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { PostViewModel } from "../../dto/post.view.model";
import { mapToPostViewModel } from "../mappers/map-to post-view-model.util";
export async function  getPostListHandler(req: Request, res: Response<PostViewModel[]>){
    try{
        const posts = await postRepository.getAllPosts()
        const postViewModel = posts.map(mapToPostViewModel)
        res.status(HttpStatus.Ok).send(postViewModel)
    } catch{
             res.sendStatus(HttpStatus.InternalServerError)
  
    }
}
