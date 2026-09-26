import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { mapBlogInputDtoToBlog } from "../mappers/map-blog-input-dto-to-blog.util";


export async function updateBlogHandler(
    req: RequestWithParamsAndBody<{id:string},BlogInputDto>,  res: Response){
    try{
        const id = req.params.id
        const foundBlog = await blogsRepository.getBlogById(id)
            if (!foundBlog){
        res.status(HttpStatus.NotFound)
        .send(createErrorMessages([{message:'Blog not found',field:'id'}])
      )
        return
    }
      await blogsRepository.updateBlog(req.params.id, mapBlogInputDtoToBlog(req.body))
      res.sendStatus(HttpStatus.NoContent)


      
    }catch{
        res.sendStatus(HttpStatus.InternalServerError)
    }

}
