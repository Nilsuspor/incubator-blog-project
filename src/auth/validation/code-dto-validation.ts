import { body } from 'express-validator';

export const codeValidation = [
  body('code')
    .isString().withMessage('Code must be a string')
    .trim()
    .notEmpty().withMessage('Code is required')
];