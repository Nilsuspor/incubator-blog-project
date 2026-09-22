import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { getPostViewModel } from "../../post.mapper";
import { RequestWithParams } from "../../../core/types/request_types";
import { PostViewModel } from "../../dto/post.view.model";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";


export function getPostHandler(req: RequestWithParams<{id:string}>, res: Response<PostViewModel| ValidationErrorDto >){
    const foundPost = postRepository.getPostById(req.params.id)
      if (!foundPost){
        res.status(HttpStatus.NotFound).send(createErrorMessages([{message:'Post not found',field:'id'}]))
        return
      }
      res.status(HttpStatus.Ok).send(getPostViewModel(foundPost))
}