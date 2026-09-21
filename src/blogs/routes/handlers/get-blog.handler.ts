import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { getBlogViewModel } from "../../blog.mapper";
import { RequestWithParams } from "../../../core/types/request_types";
import { BlogViewModel } from "../../dto/blog.view.model";

export function getBlogHandler(req: RequestWithParams<{id:string}>, res: Response<BlogViewModel>){
    const foundBlog = blogsRepository.getBlogById(req.params.id)
      if (!foundBlog){
        res.sendStatus(HttpStatus.NotFound)
        return
      }
      res.status(HttpStatus.Ok).send(getBlogViewModel(foundBlog));
}