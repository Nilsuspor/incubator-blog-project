import { RequestWithParams } from "../../../core/types/request_types";
import { blogsRepository } from "../../repository/blog.repository";
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../../posts/repository/post.repository";

export function deleteBlogHandler (req: RequestWithParams<{id:string}>, res: Response){
    if (!blogsRepository.deleteBlog(req.params.id)){
        res.sendStatus(HttpStatus.NotFound)
        return
      } 
      postRepository.deletePostsByBlogId(req.params.id);  
      res.sendStatus(HttpStatus.NoContent)
      
}