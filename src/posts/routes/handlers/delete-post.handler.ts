import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParams } from "../../../core/types/request_types";


export function deletePostHandler (req: RequestWithParams<{id:string}>, res: Response){
    if (!postRepository.deletePost(req.params.id)){
       res.sendStatus(HttpStatus.NotFound)
       return
     } else{
     res.sendStatus(HttpStatus.NoContent)
     }
}