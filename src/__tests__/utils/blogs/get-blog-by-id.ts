import request from 'supertest'
import { Express } from 'express'
import { BlogViewModel } from '../../../blogs/dto/blog.view.model'
import { BLOGS_PATH } from '../../../blogs/constants/blogs.path'
import { HttpStatus } from '../../../core/types/http-statuses'
import { generateBasicAuthToken } from '../generate-admin-auth-token'


export async function getBlogById(app:Express, blogId: string,):Promise<BlogViewModel>{
    const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok)

    return blogResponse.body
}