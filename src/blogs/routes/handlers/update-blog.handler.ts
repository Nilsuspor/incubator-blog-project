import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";

export function updateBlogHandler(req: RequestWithParamsAndBody<{id:string},BlogInputDto>,  res: Response){
    if (!blogsRepository.updateBlog(req.params.id, req.body)){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.sendStatus(HttpStatus.NoContent)
}