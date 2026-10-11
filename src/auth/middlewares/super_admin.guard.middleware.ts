import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../settings/config';

export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const authType = parts[0];
  const token = parts[1];

  if (authType !== 'Basic') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  try {
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    next();
    
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
};