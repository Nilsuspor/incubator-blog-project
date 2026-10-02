import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { BlogService } from "../../application/blogs.servise";


export async function updateBlogHandler(
    req: RequestWithParamsAndBody<{id:string},BlogInputDto>,  res: Response){
    try{
        const isBlogUpdated = await BlogService.updateBlogServise(req.params.id, req.body)
            if (!isBlogUpdated){
        res.status(HttpStatus.NotFound)
        .send(createErrorMessages([{message:'Blog not found',field:'id'}])
      )
        return
    }
      res.sendStatus(HttpStatus.NoContent)
    }catch{
        res.sendStatus(HttpStatus.InternalServerError)
    }

}
