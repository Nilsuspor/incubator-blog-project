import { RequestWithBody } from "../../../core/types/request_types";
import {  Response } from "express";
import { AuthServices } from "../../application/auth.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";


export const activationUserHandler = async (req: RequestWithBody<{code:string}>, 
    res:Response)=>{
    try{
        const result = await AuthServices.confirmUser(req.body.code)

        if (result.status === ResultStatus.BadRequest){
            res.status(HttpStatus.BadRequest).send({
                errorsMessages: result.extensions
            })
            return
        }

        res.sendStatus(HttpStatus.NoContent)
    } catch (e: unknown) {
        errorsHandler(e, res); 
    }
}