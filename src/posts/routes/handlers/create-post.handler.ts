import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { PostViewModel } from "../../dto/post.view.model";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { PostServices } from "../../application/post.servise";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";

export async function createPostHandler(req: RequestWithBody<PostInputDto>, 
  res: Response<PostViewModel|ValidationErrorDto>){
    try{
      const blogId = req.body.blogId;
      const createdPost = await PostServices.createPostService(blogId,req.body)
      if (!createdPost) {
      res.status(HttpStatus.NotFound).send(createErrorMessages([{message:'Blog not found',field:'BlogId'}]));
      return;
    }
      res.status(HttpStatus.Created).send(createdPost)  
    } catch{
        res.sendStatus(HttpStatus.InternalServerError)
    } 
    
    
  }
