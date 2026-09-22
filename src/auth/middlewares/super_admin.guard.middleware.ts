import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ADMIN_USERNAME,ADMIN_PASSWORD } from '../../settings/config';

export const superAdminGuardMiddleware = (
    req: Request,
  res: Response,
  next: NextFunction,
) =>{
    const auth = req.headers['authorization'] as string; // 'Basic xxxx'

  if (!auth) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [authType, token] = auth.split(' ');

  if (authType !== 'Basic') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  // Декодируем base64 и разбираем на логин и пароль.
  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  next();
};
