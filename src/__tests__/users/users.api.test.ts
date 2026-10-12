import request from 'supertest';
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { HttpStatus } from '../../core/types/http-statuses';

// Если у тебя есть вынесенная константа, импортируй ее, иначе просто строка '/users'
const USERS_PATH = '/users'; 

describe('/users', () => {
  const app = express();
  setupApp(app);
  
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb(); 
  });

  let createdUserId = '';

  it('✅ should return 200 and empty object; GET /users', async () => {
    await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken) 
      .expect(HttpStatus.Ok, {
        pagesCount: 0, 
        page: 1, 
        pageSize: 10, 
        totalCount: 0, 
        items: []
      });
  });

  it('✅ should create user; POST /users', async () => {
    const newUserDto = {
      login: 'testAdmin',
      password: 'validPassword123',
      email: 'test@email.com'
    };

    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(newUserDto)
      .expect(HttpStatus.Created);

    createdUserId = response.body.id;

    // Проверяем, что вернулась правильная ViewModel
    // expect.any(String) — суперсила Jest для проверки динамических данных (ID и дат)
    expect(response.body).toEqual({
      id: expect.any(String),
      login: newUserDto.login,
      email: newUserDto.email,
      createdAt: expect.any(String) 
    });
  });

  it('✅ should delete user and check after that list is empty; DELETE /users/:id', async () => {
    // 1. Успешно удаляем юзера по сохраненному ID
    await request(app)
      .delete(`${USERS_PATH}/${createdUserId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    // 2. У нас нет эндпоинта GET /users/:id по ТЗ, поэтому мы проверяем удаление, 
    // запрашивая общий список. Он снова должен быть пустым.
    await request(app)
      .get(USERS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok, {
        pagesCount: 0, 
        page: 1, 
        pageSize: 10, 
        totalCount: 0, 
        items: []
      });
  });
});