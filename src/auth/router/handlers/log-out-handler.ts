import { Request,Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { AuthServices } from "../../application/auth.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resulstCodeToHttpException";


export const logOutHandler = async (req: Request, res: Response) => {
    const userId = req.user?.id;
  const deviceId = req.deviceId;

  if (!userId || !deviceId) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const result = await AuthServices.logOut(userId, deviceId);

  if (result.status !== ResultStatus.Success) {
    res
      .status(resultCodeToHttpException(result.status))
      .send({ errorsMessages: result.extensions });
    return;
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(HttpStatus.NoContent);
}