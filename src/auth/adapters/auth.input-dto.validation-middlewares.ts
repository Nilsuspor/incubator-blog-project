import { body } from 'express-validator';

export const loginValidation = [
    body('loginOrEmail')
        .isString().withMessage('loginOrEmail must be a string')
        .trim().notEmpty().withMessage('loginOrEmail cannot be empty'), 
        
    body('password')
        .isString().withMessage('password must be a string')
        .trim().notEmpty().withMessage('password cannot be empty')
];