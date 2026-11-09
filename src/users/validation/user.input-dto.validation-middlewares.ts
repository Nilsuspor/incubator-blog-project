import { body } from 'express-validator';

export const userInputDtoValidation = [
    body('login')
        .isString().trim()
        .isLength({ min: 3, max: 10 }).withMessage('Login must be from 3 to 10 characters')
        .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Invalid login format'),
        
    body('password')
        .isString().trim()
        .isLength({ min: 6, max: 20 }).withMessage('Password must be from 6 to 20 characters'),
        
    body('email')
    .isString().withMessage('Email must be a string')
    .trim()
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).withMessage('Invalid email format')
];