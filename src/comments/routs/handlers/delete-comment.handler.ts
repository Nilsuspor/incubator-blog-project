import { RequestWithParams } from "../../../core/types/request_types";
import { Response } from "express";
import { commentsServices } from "../../application/comment.servise";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function deleteCommentHandler(
    req: RequestWithParams<{id:string}>, 
    res: Response,
){
    try {
        await commentsServices.deleteOne(req.params.id)
        res.sendStatus(HttpStatus.NoContent);
    } catch (e:unknown){
        errorsHandler(e,res)
    }
}