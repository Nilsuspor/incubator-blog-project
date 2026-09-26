import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { getBlogViewModel } from "../../blog.mapper";
import { RequestWithBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";
import { BlogViewModel } from "../../dto/blog.view.model";
import { mapBlogInputDtoToBlog } from "../mappers/map-blog-input-dto-to-blog.util";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";





export async function createBlogHandler(
    req: RequestWithBody<BlogInputDto>, res: Response<BlogViewModel>){
    try {
        const newBlog = {
            ...mapBlogInputDtoToBlog(req.body),
            createdAt: new Date().toISOString(),
            isMembership: false
        }

    const createdBlog = await blogsRepository.createBlog(newBlog)
    const blogViewModel = mapToBlogViewModel(createdBlog)
    res.status(HttpStatus.Created).send(blogViewModel)        
    } catch {
        res.sendStatus(HttpStatus.InternalServerError)
    }   




}