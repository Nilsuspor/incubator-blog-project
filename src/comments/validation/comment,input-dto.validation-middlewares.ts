import { body } from "express-validator"

export const commentInputDtoValidation = [
    body('content')
            .isString().trim()
            .isLength({ min: 20, max: 300 }).withMessage('Comment must be from 20 to 10 characters')
            
]