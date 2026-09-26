import { RequestWithParams } from "../../../core/types/request_types";
import { blogsRepository } from "../../repository/blog.repository";
import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../../posts/repository/post.repository";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { sensitiveHeaders } from "node:http2";

export async function deleteBlogHandler (req: RequestWithParams<{id:string}>,
    res: Response){
   try{
           const id = req.params.id
           const foundBlog = await blogsRepository.getBlogById(id)
               if (!foundBlog){
           res.status(HttpStatus.NotFound)
           .send(createErrorMessages([{message:'Blog not found',field:'id'}])
         )
           return
       }
        await blogsRepository.deleteBlog(id)
        res.sendStatus(HttpStatus.NoContent)
       }catch{
          res.sendStatus(HttpStatus.InternalServerError)
       }
}