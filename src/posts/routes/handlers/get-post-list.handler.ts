import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostViewModel } from "../../dto/post.view.model";
import { PostServices } from "../../application/post.servise";
export async function  getPostListHandler(req: Request, res: Response<PostViewModel[]>){
    try{
        const allPosts = await PostServices.FindAllPostsService()
        res.status(HttpStatus.Ok).send(allPosts)
    } catch{
             res.sendStatus(HttpStatus.InternalServerError)
  
    }
}
