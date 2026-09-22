import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";

export function updateBlogHandler(req: RequestWithParamsAndBody<{id:string},BlogInputDto>,  res: Response){
    if (!blogsRepository.updateBlog(req.params.id, req.body)){
        res.status(HttpStatus.NotFound).send(createErrorMessages([{message:'Blog not found',field:'id'}]))
        return
      }
      res.sendStatus(HttpStatus.NoContent)
}