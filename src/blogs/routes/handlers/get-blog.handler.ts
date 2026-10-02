import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { RequestWithParams } from "../../../core/types/request_types";
import { BlogViewModel } from "../../dto/blog.view.model";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { BlogService } from "../../application/blogs.servise";



export async function getBlogHandler(req: RequestWithParams<{id:string}>, res: Response<BlogViewModel | ValidationErrorDto>){
  try {
    const foundBlog = await BlogService.getBlogByIdServise(req.params.id)
     if (!foundBlog){
        res.status(HttpStatus.NotFound)
        .send(createErrorMessages([{message:'Blog not found',field:'id'}])
      )
        return
      }
  
    res.status(HttpStatus.Ok).send(foundBlog)

  }  catch {
    res.sendStatus(HttpStatus.InternalServerError)
  }

 
      
     
}