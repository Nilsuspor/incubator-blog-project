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
});