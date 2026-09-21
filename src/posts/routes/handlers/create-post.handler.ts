import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { getPostViewModel } from "../../post.mapper";

export function createPostHandler(req: RequestWithBody<PostInputDto>, res: Response){
const newPost = postRepository.createPost(req.body)
      if(newPost===null){
        res.sendStatus(HttpStatus.BadRequest)
        return
      }else{
    res.status(HttpStatus.Created).send(getPostViewModel(newPost))
      }
    }
