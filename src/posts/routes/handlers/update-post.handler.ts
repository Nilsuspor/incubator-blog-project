import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { getPostViewModel } from "../../post.mapper";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";

export function updatePostHandler(req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response){
    if (!postRepository.updatePost(req.params.id, req.body)){
              res.status(HttpStatus.NotFound).send(createErrorMessages([{message:'Post not found',field:'id'}]))
              return
            }else{
            res.sendStatus(HttpStatus.NoContent)}

}