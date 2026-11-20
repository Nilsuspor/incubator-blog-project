import { Request,Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { AuthServices } from "../../application/auth.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resulstCodeToHttpException";

export const refreshTokenHandler = async (req: Request, res: Response) => {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken){
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }

    const result = await AuthServices.refreshUserTokens(oldToken)

    if (result.status !== ResultStatus.Success|| !result.data){
      return res.status(resultCodeToHttpException(result.status)).send({errorsMessages:result.extensions});      
    }

    const { accessToken, refreshToken } = result.data!;

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
    });

    return res.status(HttpStatus.Ok).send({ accessToken });
}