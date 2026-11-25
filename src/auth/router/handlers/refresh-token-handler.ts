import { Request,Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { AuthServices } from "../../application/auth.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resulstCodeToHttpException";

export const refreshTokenHandler = async (req: Request, res: Response) => {
   const userId = req.user?.id;
  const deviceId = req.deviceId;

  if (!userId || !deviceId) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const result = await AuthServices.refreshUserTokens(userId, deviceId);

  if (result.status !== ResultStatus.Success || !result.data) {
    res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }

  const { accessToken, refreshToken } = result.data;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
  });

  res.status(HttpStatus.Ok).send({ accessToken });
}