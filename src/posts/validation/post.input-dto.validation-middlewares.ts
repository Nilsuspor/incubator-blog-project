import {body} from 'express-validator'
import { blogsQueryRepository } from '../../blogs/repository/blog.query.repository' 

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
    .custom(async (value) => {
        try {
            const blog = await blogsQueryRepository.findById(value);
            if (!blog) {
                throw new Error('Blog not found'); 
            }
            return true;
        } catch (error) {
            throw new Error('Blog not found or invalid ID format');
        }
    })
    .withMessage('Blog not found')
      

export const postInputDtoValidation = [
    titleValidation,
    shortDescriptionValidation,
    contentValidation,
    blogIdValidation
]    

export const postForBlogInputValidation = [
  titleValidation,
      shortDescriptionValidation,
  contentValidation
  // blogId здесь НЕ проверяем, мы возьмем его из URL
];