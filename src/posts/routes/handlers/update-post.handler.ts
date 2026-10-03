import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { PostServices } from "../../application/post.servise";

export async function updatePostHandler(req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response){
  try {  
    const isUpdated = await PostServices.updatePostService(req.params.id, req.body);  
    if (!isUpdated) {
      res.status(HttpStatus.NotFound).send(
        createErrorMessages([{ message: 'Not found', field: 'id' }])
      );
      return;
    }
    res.sendStatus(HttpStatus.NoContent);
    }catch{
        res.sendStatus(HttpStatus.InternalServerError)
  }
}