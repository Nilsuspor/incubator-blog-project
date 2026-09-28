import request from 'supertest'
import { Express } from 'express'
import { BlogInputDto } from '../../../blogs/dto/blog.input.dto'
import { getBlogDTO } from './get-blog-dto'
import { BLOGS_PATH } from '../../../blogs/constants/blogs.path'
import { HttpStatus } from '../../../core/types/http-statuses'
import { generateBasicAuthToken } from '../generate-admin-auth-token'

export async function updateBlog(
    app:Express, 
    blogId:string,
    blogDto?:Partial<BlogInputDto>
    ):Promise<void> {
    const defaultBlogData : BlogInputDto = getBlogDTO();

    const testBlogData = {...defaultBlogData,...blogDto};

    const createdBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent)
    
    return 
}