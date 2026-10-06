import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../../posts/dto/post.input.dto";
import { PostViewModel } from "../../../posts/dto/post.view.model";
import { Request, Response } from "express";
import { BlogServices } from "../../application/blogs.servise";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostServices } from "../../../posts/application/post.servise";

export async function createPostforBlogHandler(req: RequestWithParamsAndBody<{ id: string }, PostInputDto>,res: Response) {
    try{
        const blogId = req.params.id;

    const createdPost = await PostServices.createPostService(blogId, req.body);
    if (!createdPost) {
            res.sendStatus(HttpStatus.NotFound);
            return; 
        }    


    res.status(HttpStatus.Created).send(createdPost);
        

    }catch (e: unknown) {
        
        console.log('🚨 ОШИБКА В ХЕНДЛЕРЕ POST /blogs/:id/posts:', e);
        res.sendStatus(HttpStatus.InternalServerError);
    }
    
}