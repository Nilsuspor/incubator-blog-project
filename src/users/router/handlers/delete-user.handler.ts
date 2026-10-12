import { RequestWithParams, RequestWithParamsAndBody } from "../../../core/types/request_types";
import { Request, Response } from "express";
import { UserServices } from "../../application/user.service";
import { HttpStatus } from "../../../core/types/http-statuses";

export async function deleteUserHandler(req: RequestWithParams<{id:string}>, res: Response) 
{
    try {
        const isDeleted = await UserServices.delete(req.params.id)

        if (!isDeleted){
            res.sendStatus(HttpStatus.NotFound)
            return
        }
        res.sendStatus(HttpStatus.NoContent)
    }catch (e: unknown) {
    console.log('🚨 ОШИБКА deleteUserHandler:', e);
    res.sendStatus(HttpStatus.InternalServerError);
}
}