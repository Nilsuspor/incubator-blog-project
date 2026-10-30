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

  it('✅should return 200 and empty object', async()=>{
          await request(app)
          .get('/posts')
           .expect(200, {pagesCount: 0, 
        page: 1, 
        pageSize: 10, 
        totalCount: 0, 
         items: []
})
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

it('✅ should create comment for post; POST /posts/:id/comments', async () => {
    // 1. Создаем пользователя, чтобы получить от него токен
    // (У тебя должна быть утилита createUser или запрос к /users)
    const userRes = await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({
        login: 'testUser',
        password: 'password123',
        email: 'test@test.com'
      })
      .expect(201);
    
    // 2. Логинимся, чтобы получить JWT accessToken
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        loginOrEmail: 'testUser',
        password: 'password123'
      })
      .expect(200);
      
    const accessToken = loginRes.body.accessToken;

    // 3. Создаем пост, под которым будем оставлять комментарий
    const createdPost = await createPost(app);

    // 4. Отправляем запрос на создание комментария
    const commentInput = {
      content: 'This is a test comment that is exactly 21 chars' // Помни про валидацию длины (обычно от 20 до 300)
    };

    const commentRes = await request(app)
      .post(`${POSTS_PATH}/${createdPost.id}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(commentInput)
      .expect(201); // Ожидаем статус Created

    // 5. Проверяем структуру возвращаемого комментария
    expect(commentRes.body).toEqual({
      id: expect.any(String),
      content: commentInput.content,
      commentatorInfo: {
        userId: userRes.body.id,
        userLogin: userRes.body.login
      },
      createdAt: expect.any(String) // Ожидаем любую строку даты
    });
  });

})