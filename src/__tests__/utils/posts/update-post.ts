import request from 'supertest'
import { Express } from 'express'
import { PostInputDto } from '../../../posts/dto/post.input.dto'
import { PostViewModel } from '../../../posts/dto/post.view.model'
import { createBlog } from '../blogs/create-blog'
import { getPostDto } from './get-post-dto'
import { POSTS_PATH } from '../../../posts/constants/posts.path'
import { generateBasicAuthToken } from '../generate-admin-auth-token'
import { HttpStatus } from '../../../core/types/http-statuses'


export async function updatePost(app:Express, postId:string, blogId:string, postDto?:Partial<PostInputDto>):Promise<void> {
    
    const defaultPostData: PostInputDto = getPostDto(blogId)

    const testPostData = {...defaultPostData,...postDto}

       await request(app)
        .put(`${POSTS_PATH}/${postId}`)
        .set('Authorization', generateBasicAuthToken())
        .send(testPostData)
        .expect(HttpStatus.NoContent)
        
}