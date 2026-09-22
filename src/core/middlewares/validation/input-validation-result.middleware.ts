import { ValidationError, validationResult } from 'express-validator';
import { NextFunction, Request, Response } from 'express';
import { ValidationErrorDto,ValidationErrorType } from '../../types/validation-error';
import { HttpStatus } from '../../types/http-statuses';


export const createErrorMessages = (
  errors: ValidationErrorType[],
): ValidationErrorDto => {
  return { errorsMessages: errors };
};

const formatErrors = (error: ValidationError): ValidationErrorType => {
  if (error.type === 'field') {
    return { message: error.msg, field: error.path };
  }
  return { message: error.msg, field: 'unknown' };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).json({ errorMessages: errors });
    return;
  }

  next();
};