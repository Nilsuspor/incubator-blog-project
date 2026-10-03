import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";
import { BlogViewModel } from "../../dto/blog.view.model";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { BlogServices } from "../../application/blogs.servise";


export async function createBlogHandler(
    req: RequestWithBody<BlogInputDto>, res: Response<BlogViewModel|ValidationErrorDto>){
    try {      
    const createdBlog = await BlogServices.createBlogService(req.body)
    res.status(HttpStatus.Created).send(createdBlog)        
    } catch {
        res.sendStatus(HttpStatus.InternalServerError)
    }   
}