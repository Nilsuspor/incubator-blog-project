import { body } from 'express-validator';

export const emailResendingValidation = [
  body('email')
    .isString().withMessage('Email must be a string')
    .trim()
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).withMessage('Incorrect email format')
];