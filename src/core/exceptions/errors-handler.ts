import { Response } from 'express';
import { NotFoundException } from './not-found.exception';
import { HttpStatus } from '../types/http-statuses';
import { BadRequestException } from './bad-request.exception';

export function errorsHandler(error: unknown, res: Response): void {
  console.log('🚨 ОШИБКА:', error);

  if (error instanceof NotFoundException) {
    res.sendStatus(HttpStatus.NotFound);
    return;
  }

  if (error instanceof BadRequestException){
    res.status(HttpStatus.BadRequest).json({
      errorsMessages: error.errors
    })
    return
  }

  res.sendStatus(HttpStatus.InternalServerError);
}