import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParams } from "../../../core/types/request_types";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";

export function deletePostHandler (req: RequestWithParams<{id:string}>, res: Response){
    if (!postRepository.deletePost(req.params.id)){
       res.status(HttpStatus.NotFound).send(createErrorMessages([{message:'Post not found',field:'id'}]))
       return
     } else{
     res.sendStatus(HttpStatus.NoContent)
     }
}