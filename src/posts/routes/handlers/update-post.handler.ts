import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { mapPostInputDtoToPost } from "../mappers/map-post-input-dto-to-post.util";

export async function updatePostHandler(req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response){
  try {  
  const id = req.params.id
    const foundPost = await postRepository.getPostById(id)
    if (!foundPost){
       res.status(HttpStatus.NotFound).send(createErrorMessages([{message:'Post not found',field:'id'}])
       )
    return
      }
      await postRepository.updatePost(req.params.id, mapPostInputDtoToPost(req.body))
  
    }catch{
        res.sendStatus(HttpStatus.InternalServerError)
  }
}