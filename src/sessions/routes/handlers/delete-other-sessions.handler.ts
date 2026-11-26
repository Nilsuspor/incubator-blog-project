import { Request,Response } from "express";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { sessionServices } from "../../application/sessions.service";

export async function deleteOtherSessionsHandler(
    req:Request,
    res:Response
){
    try{
        const userId = req.user?.id
        const deviceId = req.deviceId
        if (!userId|| !deviceId) {
            res.sendStatus(HttpStatus.Unauthorized);
            return;
          }
          await sessionServices.deleteOtherSessions(userId,deviceId)
          res.sendStatus(HttpStatus.NoContent)
    }catch (e:unknown){
        errorsHandler(e, res)
    }
}