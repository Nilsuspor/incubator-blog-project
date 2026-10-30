import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/request_types";
import { PostViewModel } from "../../dto/post.view.model";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { postQueryRepository } from "../../repository/post.query.repository";

export async function getPostHandler(
  req: RequestWithParams<{id:string}>,
  res: Response<PostViewModel>
){
   try{
        const foundPost = await postQueryRepository.findByIdOrFail(req.params.id)
         res.status(HttpStatus.Ok).send(foundPost);
        
   } catch (e: unknown) {
    errorsHandler(e, res);
  }
}