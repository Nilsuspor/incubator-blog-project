import request from 'supertest'
import { Express } from 'express'
import { BlogInputDto } from '../../../blogs/dto/blog.input.dto'
import { BlogViewModel } from '../../../blogs/dto/blog.view.model'
import { getBlogDTO } from './get-blog-dto'
import { BLOGS_PATH } from '../../../blogs/constants/blogs.path'
import { HttpStatus } from '../../../core/types/http-statuses'
import { generateBasicAuthToken } from '../generate-admin-auth-token'

export async function createBlog(
    app:Express, 
    blogDto?:Partial<BlogInputDto>
    ):Promise<BlogViewModel> {
    const defaultBlogData : BlogInputDto = getBlogDTO();

    const testBlogData = {...defaultBlogData,...blogDto};

    const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created)
    
    return createdBlogResponse.body
}