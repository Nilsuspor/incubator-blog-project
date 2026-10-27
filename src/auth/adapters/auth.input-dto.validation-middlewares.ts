import { body } from 'express-validator';

export const loginValidation = [
    body('loginOrEmail')
        .isString().withMessage('loginOrEmail must be a string')
        .trim().notEmpty().withMessage('loginOrEmail cannot be empty')
        .isLength({min: 1, max: 500}).withMessage('invalid lenth'), 
        
    body('password')
        .isString().withMessage('password must be a string')
        .trim().notEmpty().withMessage('password cannot be empty')
        .isLength({min: 6, max: 20})
        .withMessage("invalid lenth"),
];