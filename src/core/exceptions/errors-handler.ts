import { Response } from 'express';
import { NotFoundException } from './not-found.exception';
import { HttpStatus } from '../types/http-statuses';

export function errorsHandler(error: unknown, res: Response): void {
  console.log('🚨 ОШИБКА:', error);

  if (error instanceof NotFoundException) {

    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  res.sendStatus(HttpStatus.InternalServerError);
}