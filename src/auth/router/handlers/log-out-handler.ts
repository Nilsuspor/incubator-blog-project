import { Request,Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { AuthServices } from "../../application/auth.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resulstCodeToHttpException";


export const logOutHandler = async (req: Request, res: Response) => {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken){
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }

    const result = await AuthServices.logOut(oldToken)

    if (result.status !== ResultStatus.Success){
      return res.status(resultCodeToHttpException(result.status)).send({errorsMessages:result.extensions});      
    }
    res.clearCookie('refreshToken')
    return res.sendStatus(HttpStatus.NoContent)
}