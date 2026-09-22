import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { getBlogViewModel } from "../../blog.mapper";
import { RequestWithParams } from "../../../core/types/request_types";
import { BlogViewModel } from "../../dto/blog.view.model";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { ValidationErrorDto } from "../../../core/types/validation-error";

export function getBlogHandler(req: RequestWithParams<{id:string}>, res: Response<BlogViewModel | ValidationErrorDto>){
    const foundBlog = blogsRepository.getBlogById(req.params.id)
      if (!foundBlog){
        res.status(HttpStatus.NotFound)
        .send(createErrorMessages([{message:'Blog not found',field:'id'}]))
        return
      }
      res.status(HttpStatus.Ok).send(getBlogViewModel(foundBlog));
}