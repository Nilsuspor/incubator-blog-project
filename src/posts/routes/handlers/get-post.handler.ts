import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";

import { RequestWithParams } from "../../../core/types/request_types";
import { PostViewModel } from "../../dto/post.view.model";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { mapToPostViewModel } from "../mappers/map-to post-view-model.util";

export async function getPostHandler(req: RequestWithParams<{id:string}>, res: Response<PostViewModel| ValidationErrorDto >){
   try{
     const id = req.params.id
        const foundPost = await postRepository.getPostById(id)
         if (!foundPost){
            res.status(HttpStatus.NotFound)
            .send(createErrorMessages([{message:'Post not found',field:'id'}])
          )
            return
          }
          const postViewModel = mapToPostViewModel(foundPost)
          res.status(HttpStatus.Ok).send(postViewModel)
   } catch{
          res.sendStatus(HttpStatus.InternalServerError)

   }
}