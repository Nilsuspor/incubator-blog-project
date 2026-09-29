import request from 'supertest'
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { PostInputDto } from '../../posts/dto/post.input.dto';
import { createPost } from '../utils/posts/create-post';
import { createBlog } from '../utils/blogs/create-blog';
import { updatePost } from '../utils/posts/update-post';
import { getPostById } from '../utils/posts/get-post-by-id';
import { POSTS_PATH } from '../../posts/constants/posts.path';
import { HttpStatus } from '../../core/types/http-statuses';


describe('/posts',()=>{
    const app = express();
  setupApp(app);
   
    const adminToken = generateBasicAuthToken();

  
  beforeAll(async ()=>{
    
    await runDB(SETTINGS.MONGO_URL)
    await clearDb(app)
  })

    afterAll(async () => {
    await stopDb(); 
  });

  it('✅should return 200 and empty array', async()=>{
          await request(app)
          .get('/posts')
          .expect(200, [])
      })

 it('✅ should create post; POST /posts', async()=>{
       await createPost(app)
       
    })

  it ('✅should return post by id; GET /posts/:id', async ()=>{
        const createdPost = await createPost(app)
          
        const blog = await getPostById(app,  createdPost.id)
    
        expect(blog).toEqual(createdPost)
    
        })


it('✅ should update post; PUT /posts/:id', async()=>{
  const newBlog = await createBlog(app)     
  const createdPost =await createPost(app)

  const postUpdateData:PostInputDto = {
    title:'Пироги',
    shortDescription : 'Такие пироги',
    content : 'Зассыха',
    blogId: newBlog.id
  }     

  await updatePost(app, createdPost.id, newBlog.id, postUpdateData)
        
  const postResponse = await getPostById(app, createdPost.id)

  expect(postResponse).toEqual({
    id:createdPost.id,
    title:postUpdateData.title,
    shortDescription:postUpdateData.shortDescription,
    content:postUpdateData.content,
    blogId:newBlog.id,
    blogName: newBlog.name,
    createdAt:createdPost.createdAt
  })
  

    })

     it('✅should delete post and check after "NOT FOUND"; DELETE /posts/:id', async()=>{
          const createdPost = await createPost(app)
    
          await request(app)
          .delete(`${POSTS_PATH}/${createdPost.id}`)
          .set('Authorization', adminToken)
          .expect(HttpStatus.NoContent)
    
          await request(app)
          .get(`${POSTS_PATH}/${createdPost.id}`)
          .set('Authorization', adminToken)
          .expect(HttpStatus.NotFound)


})

})