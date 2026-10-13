
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

describe('/auth/login - Negative Scenarios', () => {
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

  const validUserDto = {
    login: 'testNinja',
    password: 'validPassword123',
    email: 'ninja@email.com'
  };

  it('✅ should create user for negative auth tests; POST /users', async () => {
    await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(validUserDto)
      .expect(HttpStatus.Created);
  });

  it('❌ should return 401 if password is wrong; POST /auth/login', async () => {
    await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: validUserDto.login, // Логин верный
        password: 'wrongPassword456'      // Пароль специально ломаем
      })
      .expect(HttpStatus.Unauthorized); // Ждем 401
  });

  it('❌ should return 401 if user does not exist; POST /auth/login', async () => {
    await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: 'nonExistentUser', // Такого юзера в базе нет
        password: 'somePassword123'
      })
      .expect(HttpStatus.Unauthorized); // Ждем 401
  });

  it('❌ should return 400 if validation fails (empty body); POST /auth/login', async () => {
    const response = await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({}) // Отправляем пустой объект
      .expect(HttpStatus.BadRequest); // Ждем 400

    // Проверяем, что express-validator поймал ошибки для обоих полей
    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'loginOrEmail' }),
        expect.objectContaining({ field: 'password' })
      ])
    );
  });
  
  it('❌ should return 400 if validation fails (incorrect types); POST /auth/login', async () => {
    const response = await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: 12345,  // Ошибка: ждем строку, а пришло число
        password: true        // Ошибка: ждем строку, а пришел boolean
      })
      .expect(HttpStatus.BadRequest);
      
    // Снова проверяем, что валидатор отругал именно эти поля
    expect(response.body.errorsMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'loginOrEmail' }),
        expect.objectContaining({ field: 'password' })
      ])
    );
  });

  it('❌ INCUBATOR BUG: should return 401 if correct login but wrong password is provided', async () => {
    // 1. Создаем нового юзера (как это делает автотестер Инкубатора)
    const bugUser = {
      login: 'lg-44222',
      password: 'qwerty_password', // 15 символов, теперь пролезет!
      email: 'bug@example.com'
    };

    // Регистрируем его
    await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(bugUser)
      .expect(HttpStatus.Created);

    // 2. Пытаемся залогиниться с ПРАВИЛЬНЫМ логином, но НЕПРАВИЛЬНЫМ паролем
    // Автотестер Инкубатора присылает 'qwerty1' вместо правильного пароля
    await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: bugUser.login, // правильный логин
        password: 'wrong123'          // неверный пароль (как в логах ошибки)
      })
      // Твой сервер должен ответить 401. Если он пустит (204) — тест локально упадет!
      .expect(HttpStatus.Unauthorized); 
  });
});