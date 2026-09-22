import { RequestWithParams } from "../../../core/types/request_types";
import { blogsRepository } from "../../repository/blog.repository";
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../../posts/repository/post.repository";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";

export function deleteBlogHandler (req: RequestWithParams<{id:string}>,
    res: Response){
    if (!blogsRepository.deleteBlog(req.params.id)){
        res.status(HttpStatus.NotFound)
        .send(createErrorMessages([{message:'Blog not found',field:'id'}]))
        return
      } 
      postRepository.deletePostsByBlogId(req.params.id);  
      res.sendStatus(HttpStatus.NoContent)
      
}