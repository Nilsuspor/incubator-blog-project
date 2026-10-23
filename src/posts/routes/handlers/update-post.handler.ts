import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { PostServices } from "../../application/post.servise";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function updatePostHandler(req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response){
  try {  
    await PostServices.updatePostService(req.params.id, req.body);  
    res.sendStatus(HttpStatus.NoContent);
    }catch (e: unknown) {
                errorsHandler(e, res);
  }
}