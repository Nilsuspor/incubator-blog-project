import {  Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/request_types";
import { BlogViewModel } from "../../dto/blog.view.model";
import { blogsQueryRepository } from "../../repository/blog.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";


export async function getBlogHandler(
  req: RequestWithParams<{id: string}>, 
  res: Response<BlogViewModel>
) {
  try {
    const foundBlog = await blogsQueryRepository.findByIdOrFail(req.params.id);
    res.status(HttpStatus.Ok).send(foundBlog);
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
