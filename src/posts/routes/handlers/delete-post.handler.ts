import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParams } from "../../../core/types/request_types";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";

export async function deletePostHandler (req: RequestWithParams<{id:string}>, res: Response){
  try {
  
  const id = req.params.id
   const foundPost = postRepository.getPostById(id)
   if (!foundPost){
      res.status(HttpStatus.NotFound)
           .send(createErrorMessages([{message:'Post not found',field:'id'}])
         )
           return
   } await postRepository.deletePost(id)
      res.sendStatus(HttpStatus.NoContent)
    
    }catch{
       res.sendStatus(HttpStatus.InternalServerError)
    }
}