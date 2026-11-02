import { RequestWithParamsAndUserId } from "../../../core/types/request_types";
import { Response } from "express";
import { commentsServices } from "../../application/comment.servise";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { IdType } from "../../../core/types/id";

export async function deleteCommentHandler(
    req: RequestWithParamsAndUserId<{id:string}, IdType>, 
    res: Response,
){
    console.log("=== DELETE HANDLER ===");
    console.log("req.headers.authorization:", req.headers.authorization);
    console.log("req.user:", req.user);
    console.log("======================");
    try {
        if (!req.user) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
    }        
    const userId = req.user.id

        await commentsServices.deleteOne(req.params.id, userId)
        res.sendStatus(HttpStatus.NoContent);
    } catch (e:unknown){
        errorsHandler(e,res)
    }
}