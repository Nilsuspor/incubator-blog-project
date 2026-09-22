import {body} from 'express-validator'
import { blogsRepository } from '../../blogs/repository/blog.repository'

const titleValidation = body('title')
.isString()
.withMessage('title should be string')
.trim()
.isLength({min:1,max:30})
.withMessage('Length of title is not correct')


const shortDescriptionValidation = body('shortDescription')
.isString()
.withMessage('shortDescription should be string')
.trim()
.isLength({min:1,max:100})
.withMessage('Length of shortDescription is not correct')

const contentValidation = body('content')
.isString()
.withMessage('content should be string')
.trim()
.isLength({min:1,max:1000})
.withMessage('Length of content is not correct')

const blogIdValidation = body('blogId')
    .isString()
    .withMessage('blogId should be string')
    .isNumeric()
    .withMessage('blogId must be a numeric string')
    .custom((value)=>{
        const blog = blogsRepository.getBlogById(value);
        if (!blog){
            return false
        }
        return true;
    })
    .withMessage('Blog not found')
      

export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
]    