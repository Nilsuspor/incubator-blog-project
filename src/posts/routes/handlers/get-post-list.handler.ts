import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { getPostViewModel } from "../../post.mapper";
import { PostViewModel } from "../../dto/post.view.model";

export function getPostListHandler(req: Request, res: Response<PostViewModel[]>){
    res.status(HttpStatus.Ok).send(postRepository.getAllPosts().map(getPostViewModel))
}
