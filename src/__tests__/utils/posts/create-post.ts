import request from 'supertest'
import { Express } from 'express'
import { PostInputDto } from '../../../posts/dto/post.input.dto'
import { PostViewModel } from '../../../posts/dto/post.view.model'
import { createBlog } from '../blogs/create-blog'
import { getPostDto } from './get-post-dto'
import { POSTS_PATH } from '../../../posts/constants/posts.path'
import { generateBasicAuthToken } from '../generate-admin-auth-token'
import { HttpStatus } from '../../../core/types/http-statuses'


export async function createPost(app:Express, postDto?:Partial<PostInputDto>):Promise<PostViewModel> {
    const blog = await createBlog(app)
    const defaultPostData = getPostDto(blog.id)

    const testPostData = {...defaultPostData, ...postDto}
    const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)

  expect(createdPostResponse.status).toBe(HttpStatus.Created);
    return createdPostResponse.body
    
}