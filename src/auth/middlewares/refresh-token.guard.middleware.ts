import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { jwtService } from "../adapters/jwt.service";
import { sessionRepository } from "../../sessions/repository/session.repository";

export async function refreshTokenGuard(
    req: Request,
    res: Response,
    next: NextFunction
):Promise<void>{
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken){
        res.sendStatus(HttpStatus.Unauthorized)
        return
    }

    const payload = await jwtService.verifyRefreshToken(refreshToken);
  if (!payload) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const session = await sessionRepository.findByDeviceId(payload.deviceId);
  if (!session) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  
  const tokenIssuedAt = new Date(payload.iat * 1000).toISOString();
  if (
    session.userId !== payload.userId ||
    session.lastActiveDate !== tokenIssuedAt
  ) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  req.user = { id: payload.userId };
  req.deviceId = payload.deviceId;
  next();

}