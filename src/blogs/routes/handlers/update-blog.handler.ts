import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { BlogInputDto } from "../../dto/blog.input.dto";
import { BlogServices } from "../../application/blogs.servise";
import { errorsHandler } from "../../../core/exceptions/errors-handler";


export async function updateBlogHandler(
    req: RequestWithParamsAndBody<{id:string},BlogInputDto>,  res: Response){
    try{
        const isBlogUpdated = await BlogServices.updateBlogService(req.params.id, req.body)
      res.sendStatus(HttpStatus.NoContent)
    }catch (e: unknown) {
        errorsHandler(e, res);
    }

}
