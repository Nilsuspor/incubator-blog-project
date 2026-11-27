import { Request, Response } from "express";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { HttpStatus } from "../../../core/types/http-statuses";
import { sessionServices } from "../../application/sessions.service";
import { RequestWithParams } from "../../../core/types/request_types";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resulstCodeToHttpException";

export async function deleteSessionByDeviceIdHandler(
    req: RequestWithParams<{deviceId:string}>,
    res: Response
){
    try {
        const userId = req.user?.id
        const deviceId = req.params.deviceId

        if (!userId) {
            res.sendStatus(HttpStatus.Unauthorized);
        return;
    }
       const deleteResult = await sessionServices.deleteSessionByDeviceId(userId, deviceId);

    if (deleteResult.status !== ResultStatus.Success) {
     res.sendStatus(resultCodeToHttpException(deleteResult.status));
    return;
    }

    res.sendStatus(HttpStatus.NoContent);
    }catch (e:unknown){
        errorsHandler(e, res)
    }

}