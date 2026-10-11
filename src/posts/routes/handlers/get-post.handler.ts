import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/request_types";
import { PostViewModel } from "../../dto/post.view.model";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { PostServices } from "../../application/post.servise";

export async function getPostHandler(req: RequestWithParams<{id:string}>, res: Response<PostViewModel| ValidationErrorDto >){
   try{
        const foundPost = await PostServices.getPostByIdService(req.params.id)
         if (!foundPost){
            res.sendStatus(HttpStatus.NotFound)
            return
          }
          res.status(HttpStatus.Ok).send(foundPost)
   } catch (e: unknown) {
    console.log('🚨 ОШИБКА getPostHandler:', e);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}