import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { getPostViewModel } from "../../post.mapper";


export function updatePostHandler(req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response){
    if (!postRepository.updatePost(req.params.id, req.body)){
              res.sendStatus(HttpStatus.NotFound)
              return
            }else{
            res.sendStatus(HttpStatus.NoContent)}

}