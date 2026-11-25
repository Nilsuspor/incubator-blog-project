import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";
import { BlogViewModel } from "../../dto/blog.view.model";
import { BlogServices } from "../../application/blogs.servise";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { blogsQueryRepository } from "../../repository/blog.query.repository";

export async function createBlogHandler(
    req: RequestWithBody<BlogInputDto>, res: Response<BlogViewModel>){
    try {      
    const createdBlogId = await BlogServices.createBlog(req.body)
    const createdBlog = await blogsQueryRepository.findByIdOrFail(createdBlogId)
    res.status(HttpStatus.Created).send(createdBlog)        
    } catch (e: unknown) {
               errorsHandler(e, res);
    }   
}