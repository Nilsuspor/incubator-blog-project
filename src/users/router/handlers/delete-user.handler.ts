import { RequestWithParams } from "../../../core/types/request_types";
import { Response } from "express";
import { UserServices } from "../../application/user.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function deleteUserHandler(req: RequestWithParams<{id:string}>, res: Response) 
{
    try {
        await UserServices.delete(req.params.id)
        res.sendStatus(HttpStatus.NoContent)
    }catch (e: unknown) {
                    errorsHandler(e, res);
}
}