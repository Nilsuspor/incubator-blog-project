import { NextFunction, Request, Response } from 'express';
import { jwtServiсe } from '../adapters/jwt.service';
import { IdType } from '../../core/types/id';
import { HttpStatus } from '../../core/types/http-statuses';

export const accessTokenGuard = async (req: Request, res: Response, next : NextFunction) =>{
    if (!req.headers.authorization) return res.sendStatus(HttpStatus.Unauthorized);
    
    const [authType, token] = req.headers.authorization.split(' ')

    if (authType !== 'Bearer') return res.sendStatus(401);

    const payload = await jwtServiсe.verifyToken(token);
  if (payload) {
    const { userId } = payload;

    req.user = { id: userId } as IdType;
    next();

    return;
  }
  res.sendStatus(401);

  return;
}   