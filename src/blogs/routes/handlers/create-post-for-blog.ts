import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../../posts/dto/post.input.dto";
import {  Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostServices } from "../../../posts/application/post.servise";
import { PostViewModel } from "../../../posts/dto/post.view.model";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { postQueryRepository } from "../../../posts/repository/post.query.repository";

export async function createPostforBlogHandler(
    req: RequestWithParamsAndBody<{ id: string }, PostInputDto>,res: Response<PostViewModel>) {
    try{
        const blogId = req.params.id;
        const newPostId = await PostServices.createPostService(blogId, req.body);
        const postViewModel = await postQueryRepository.findByIdOrFail(newPostId);
        res.status(HttpStatus.Created).send(postViewModel);
    } catch (e: unknown) {
        errorsHandler(e, res);
    }
    
}