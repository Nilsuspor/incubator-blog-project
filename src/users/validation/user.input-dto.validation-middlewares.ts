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
        .isString().trim()
        .isEmail().withMessage('Invalid email format')
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
];