import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { getPostViewModel } from "../../post.mapper";
import { RequestWithParams } from "../../../core/types/request_types";
import { PostViewModel } from "../../dto/post.view.model";

export function getPostHandler(req: RequestWithParams<{id:string}>, res: Response<PostViewModel>){
    const foundPost = postRepository.getPostById(req.params.id)
      if (!foundPost){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.status(HttpStatus.Ok).send(getPostViewModel(foundPost))
}