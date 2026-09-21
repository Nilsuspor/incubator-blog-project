import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { getBlogViewModel } from "../../blog.mapper";
import { RequestWithBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";

export function createBlogHandler(req: RequestWithBody<BlogInputDto>, res: Response){
    res.status(HttpStatus.Created).send(getBlogViewModel(blogsRepository.createBlog(req.body)))
}