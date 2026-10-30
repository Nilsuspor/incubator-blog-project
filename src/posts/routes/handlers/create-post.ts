import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { PostViewModel } from "../../dto/post.view.model";
import { PostServices } from "../../application/post.servise";
import { postQueryRepository } from "../../repository/post.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";


export async function createPostHandler(req: RequestWithBody<PostInputDto>, 
  res: Response<PostViewModel>){
    try{
      const blogId = req.body.blogId;
     const newPostId = await PostServices.createPostService(blogId, req.body);
             const postViewModel = await postQueryRepository.findByIdOrFail(newPostId);
             res.status(HttpStatus.Created).send(postViewModel);
    } catch (e: unknown) {
            errorsHandler(e, res);
    } 
  }
