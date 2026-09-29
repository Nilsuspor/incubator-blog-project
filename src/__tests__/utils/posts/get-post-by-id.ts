import request from 'supertest'
import { Express } from 'express'
import { PostViewModel } from '../../../posts/dto/post.view.model'
import { POSTS_PATH } from '../../../posts/constants/posts.path'
import { generateBasicAuthToken } from '../generate-admin-auth-token'
import { HttpStatus } from '../../../core/types/http-statuses'

export async function getPostById(app:Express, postId:string):Promise<PostViewModel>{
    const postResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .set('Authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok)

    return postResponse.body
}