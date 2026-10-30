import request from 'supertest'
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { clearDb } from '../utils/clear-db';
import { PostInputDto } from '../../posts/dto/post.input.dto';
import { getPostDto } from '../utils/posts/get-post-dto';
import { createBlog } from '../utils/blogs/create-blog';
import { POSTS_PATH } from '../../posts/constants/posts.path';
import { HttpStatus } from '../../core/types/http-statuses';
import { BlogViewModel } from '../../blogs/dto/blog.view.model';
import jwt from 'jsonwebtoken';

describe('/posts', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();

  let newBlog: BlogViewModel;
  let correctTestPostData: PostInputDto;

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);

    newBlog = await createBlog(app);
    correctTestPostData = getPostDto(newBlog.id);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('❌ should not create post if unauthorized; POST /posts', async () => {
    await request(app)
      .post(POSTS_PATH)
      .send(correctTestPostData)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not create post with invalid input data; POST /posts', async () => {
    const invalidPostData = {
      title: '   ',
      shortDescription: '   ',
      content: '   ',
      blogId: '   ',
    };

    const response = await request(app)
      .post(POSTS_PATH)
      .set('Authorization', adminToken)
      .send(invalidPostData)
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toHaveLength(4);
  });

  it('✅ should return empty list if no posts were created; GET /posts', async () => {
    const response = await request(app)
      .get(POSTS_PATH)
      .expect(HttpStatus.Ok);

    expect(response.body.items).toHaveLength(0);
  });


  it('❌ should not update post with PUT if unauthorized (no headers, empty body); PUT /posts/:id', async () => {
    const fakePostId = '6acd29891416ffc3da0715d4'; // Тот самый ID из ошибки автотестера

    await request(app)
      .put(`/posts/${fakePostId}`)
      // Специально НЕ вызываем .set('Authorization', ...) — заголовков нет
      .send({}) // Пустое тело
      .expect(HttpStatus.Unauthorized); // Ожидаем 401, а не падение сервера
  });

 it('❌ should return 404 if post does not exist; POST /posts/:id/comments', async () => {
    // 1. Создаем валидный токен вручную!
    const fakeUserId = '654321654321654321654321';
    // Используем тот же секрет, что и в приложении
    const validToken = jwt.sign({ userId: fakeUserId }, SETTINGS.JWT_SECRET, { expiresIn: '1h' });

    const fakePostId = '111111111111111111111111'; // Фейковый, но валидный MongoId

    await request(app)
      .post(`${POSTS_PATH}/${fakePostId}/comments`)
      .set('Authorization', `Bearer ${validToken}`) // Отправляем наш 100% валидный токен
      .send({ content: 'This is a test comment that is exactly 21 chars' })
      .expect(HttpStatus.NotFound); 
});

it('❌ should return 404 if post does not exist; POST /posts/:id/comments', async () => {
    // 1. Создаем юзера через админский эндпоинт
    await request(app)
      .post('/users')
      .set('Authorization', adminToken)
      .send({ login: 'testUser', password: 'password123', email: 'test@test.com' });
      
    // 2. Теперь логин пройдет успешно и вернет токен!
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ loginOrEmail: 'testUser', password: 'password123' });
    const accessToken = loginRes.body.accessToken;

    const fakePostId = '111111111111111111111111';

    await request(app)
      .post(`${POSTS_PATH}/${fakePostId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ content: 'This is a test comment that is exactly 21 chars' })
      .expect(HttpStatus.NotFound); 
});
});