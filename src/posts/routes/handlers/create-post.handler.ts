import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";

import { PostViewModel } from "../../dto/post.view.model";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { blogsRepository } from "../../../blogs/repository/blog.repository";
import { mapPostInputDtoToPost } from "../mappers/map-post-input-dto-to-post.util";
import { mapToPostViewModel } from "../mappers/map-to post-view-model.util";

export async function createPostHandler(req: RequestWithBody<PostInputDto>, 
  res: Response<PostViewModel|ValidationErrorDto>){
    try{
      const foundBlog = await blogsRepository.getBlogById(req.body.blogId)
      if (!foundBlog){
        res.status(HttpStatus.NotFound)
            .send(createErrorMessages([{message:'Blog not found',field:'BlogId'}])
          )
            return
      }

      const newPost = {
        ...mapPostInputDtoToPost(req.body),
        createdAt: new Date().toISOString(),
        blogName: foundBlog.name
      }
      const createdPost = await postRepository.createPost(newPost)
      const postViewModel = mapToPostViewModel(createdPost)
      res.status(HttpStatus.Created).send(postViewModel)  
    } catch{
        res.sendStatus(HttpStatus.InternalServerError)
    } 
    
    
  }
