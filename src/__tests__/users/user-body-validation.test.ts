import request from 'supertest';
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { clearDb } from '../utils/clear-db';
import { HttpStatus } from '../../core/types/http-statuses';

// Константа пути (поправь импорт, если у тебя она в другом месте)
const USERS_PATH = '/users';

describe('NEGATIVE SCENARIOS: /users', () => {
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

  // ==========================================
  // ТЕСТЫ АВТОРИЗАЦИИ (Basic Auth Guard)
  // ==========================================

  it('❌ should not create user if unauthorized; POST /users', async () => {
    const correctUserData = {
      login: 'validLogin',
      password: 'validPassword12',
      email: 'valid@email.com'
    };

    await request(app)
      .post(USERS_PATH)
      .send(correctUserData) // Забыли .set('Authorization', adminToken)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not return users list if unauthorized; GET /users', async () => {
    await request(app)
      .get(USERS_PATH)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should not delete user if unauthorized; DELETE /users/:id', async () => {
    // Даже если ID не существует, гвард должен отбить запрос первым
    await request(app)
      .delete(`${USERS_PATH}/some-id`)
      .expect(HttpStatus.Unauthorized);
  });

  // ==========================================
  // ТЕСТЫ ВАЛИДАЦИИ (Input Validation)
  // ==========================================

  it('❌ should not create user with invalid input data (empty fields); POST /users', async () => {
    const invalidUserData = {
      login: '  ',
      password: '  ',
      email: '  '
    };

    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(invalidUserData)
      .expect(HttpStatus.BadRequest);

    // Ожидаем 3 ошибки валидации: login, password, email
    expect(response.body.errorsMessages).toHaveLength(3);
    
    // Опционально: можно точечно проверить, что ошибки прилетели именно для нужных полей
    const errorFields = response.body.errorsMessages.map((e: any) => e.field);
    expect(errorFields).toContain('login');
    expect(errorFields).toContain('password');
    expect(errorFields).toContain('email');
  });

  it('❌ should not create user with invalid length and format; POST /users', async () => {
    const invalidUserData = {
      login: 'ab', // слишком короткий (min 3)
      password: '12345', // слишком короткий (min 6)
      email: 'not-an-email' // неверный формат
    };

    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(invalidUserData)
      .expect(HttpStatus.BadRequest);

    expect(response.body.errorsMessages).toHaveLength(3);
  });

  // ==========================================
  // ТЕСТЫ БИЗНЕС-ЛОГИКИ И БД (Удаление)
  // ==========================================

  it('❌ should return 404 if trying to delete non-existing user (Valid ObjectId); DELETE /users/:id', async () => {
    // 601234567890123456789012 — это синтаксически правильный 24-символьный hex, 
    // но такого юзера нет в пустой базе
    const nonExistingValidId = '601234567890123456789012';

    await request(app)
      .delete(`${USERS_PATH}/${nonExistingValidId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  });

  it('❌ should return 404 (or 400 depending on middleware) if trying to delete user with Invalid format ID; DELETE /users/:id', async () => {
    const invalidId = '123-bad-id';

    // Если у тебя валидация ID стоит в роутере (express-validator param('id').isMongoId()), 
    // то вернется 400 BadRequest. 
    // Если мидлвари нет и проверка идет в сервисе (как мы писали изначально) — вернется 404.
    // Отрегулируй expect под свою архитектуру!
    await request(app)
      .delete(`${USERS_PATH}/${invalidId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest); // Поменяй на HttpStatus.BadRequest, если у тебя есть idValidation
  });

it('❌ should not create user with existing login; POST /users', async () => {
    // 1. Создаем первого (легального) юзера
    const firstUser = {
      login: 'Superman',
      password: 'validPassword1',
      email: 'clark@kent.com'
    };

    await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(firstUser)
      .expect(HttpStatus.Created);

    // 2. Пытаемся создать второго юзера с ТАКИМ ЖЕ логином, но другим email
    const copycatUser = {
      login: 'Superman', // Упс, занято!
      password: 'validPassword2',
      email: 'bruce@wayne.com'
    };

    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(copycatUser)
      .expect(HttpStatus.BadRequest); // Ожидаем отказ от BLL

    // 3. Проверяем, что ошибка прилетела ИМЕННО на поле login
    expect(response.body.errorsMessages).toHaveLength(1);
    expect(response.body.errorsMessages[0].field).toBe('login');
  });

  it('❌ should not create user with existing email; POST /users', async () => {
    // 1. Создаем первого (легального) юзера
    const firstUser = {
      login: 'Batman',
      password: 'validPassword1',
      email: 'admin@gotham.com'
    };

    await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(firstUser)
      .expect(HttpStatus.Created);

    // 2. Пытаемся создать второго юзера с ТАКИМ ЖЕ email, но другим логином
    const copycatUser = {
      login: 'Joker', 
      password: 'validPassword2',
      email: 'admin@gotham.com' // Упс, занято!
    };

    const response = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(copycatUser)
      .expect(HttpStatus.BadRequest); // Ожидаем отказ от BLL

    // 3. Проверяем, что ошибка прилетела ИМЕННО на поле email
    expect(response.body.errorsMessages).toHaveLength(1);
    expect(response.body.errorsMessages[0].field).toBe('email');
  });

});