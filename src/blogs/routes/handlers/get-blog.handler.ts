import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { RequestWithParams } from "../../../core/types/request_types";
import { BlogViewModel } from "../../dto/blog.view.model";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { ValidationErrorDto } from "../../../core/types/validation-error";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
export async function getBlogHandler(req: RequestWithParams<{id:string}>, res: Response<BlogViewModel | ValidationErrorDto>){
  try {
    const id = req.params.id
    const foundBlog = await blogsRepository.getBlogById(id)
     if (!foundBlog){
        res.status(HttpStatus.NotFound)
        .send(createErrorMessages([{message:'Blog not found',field:'id'}])
      )
        return
      }
    const driverViewModel =  mapToBlogViewModel(foundBlog)
    res.status(HttpStatus.Ok).send(driverViewModel)

  }  catch {
    res.sendStatus(HttpStatus.InternalServerError)
  }

 
      
     
}