import request from 'supertest';
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { HttpStatus } from '../../core/types/http-statuses';

const AUTH_LOGIN_PATH = '/auth/login';
const USERS_PATH = '/users';

describe('/auth/login', () => {
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

  // Данные юзера, с которыми мы будем работать во всех тестах
  const newUserDto = {
    login: 'testNinja',
    password: 'validPassword123',
    email: 'ninja@email.com'
  };

  it('✅ should create user for auth tests; POST /users', async () => {
    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(newUserDto)
      .expect(HttpStatus.Created);

    expect(response.body).toEqual({
      id: expect.any(String),
      login: newUserDto.login,
      email: newUserDto.email,
      createdAt: expect.any(String) 
    });
  });

  it('✅ should successfully login user by LOGIN; POST /auth/login', async () => {
    await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: newUserDto.login, // Передаем логин
        password: newUserDto.password
      })
      .expect(HttpStatus.NoContent); // Успешный ответ 204
  });

  it('✅ should successfully login user by EMAIL; POST /auth/login', async () => {
    await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: newUserDto.email, // Передаем email
        password: newUserDto.password
      })
      .expect(HttpStatus.NoContent); // Успешный ответ 204
  });
});