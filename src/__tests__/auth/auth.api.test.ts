import request from 'supertest';
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { HttpStatus } from '../../core/types/http-statuses';
import { nodemailerService } from '../../auth/adapters/nodemailer.service';
import { userCollection } from '../../db/collections';

jest.mock('../../auth/adapters/nodemailer.service', () => {
  return {
    nodemailerService: {
      // Функция-шпион, которая ничего не делает, кроме как возвращает true
      sendEmail: jest.fn().mockImplementation(() => Promise.resolve(true))
    }
  };
});

const AUTH_LOGIN_PATH = '/auth/login';
const USERS_PATH = '/users';
const REG_PATH = '/auth/registration'
const RESEND_EMAIL_PATH = '/auth/registration-email-resending'
const CONFIRMATION_PATH = '/auth/registration-confirmation'
const REFRESH_TOKEN_PATH = '/auth/refresh-token';
const LOGOUT_PATH = '/auth/logout';
const AUTH_ME_PATH = '/auth/me';


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
        loginOrEmail: newUserDto.login, 
        password: newUserDto.password
      })
      .expect(HttpStatus.Ok); 
  });

  it('✅ should successfully login user by EMAIL; POST /auth/login', async () => {
    await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: newUserDto.email,
        password: newUserDto.password
      })
      .expect(HttpStatus.Ok); 
  });
});

describe('Registration Flow', () => {
  const app = express();
  setupApp(app);
  
  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  beforeEach(async () => {
    jest.clearAllMocks(); 
  });

  afterAll(async () => {
    await stopDb();
  });

  const regDto = {
    login: 'regUser',
    password: 'password123',
    email: 'reg@test.com'
  };

  it('✅ should register user and send confirmation email', async () => {
    await request(app)
    .post(REG_PATH)
    .send({
      login:regDto.login,
      password: regDto.password,
      email: regDto.email
    })
    .expect(HttpStatus.NoContent);
 
    expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);
     

    const savedUser = await userCollection.findOne({ email: regDto.email });
     expect(savedUser).toBeDefined();

    expect(savedUser!.emailConfirmation.isConfirmed).toBe(false);

    expect(typeof savedUser!.emailConfirmation.confirmationCode).toBe('string');
  });

  it('✅ should resend confirmation email with NEW code', async () => {
    const userBeforeResend = await userCollection.findOne({ email: regDto.email });
    const oldCode = userBeforeResend!.emailConfirmation.confirmationCode;

    await request(app)
    .post(RESEND_EMAIL_PATH)
    .send({ email: regDto.email })
    .expect(HttpStatus.NoContent)



    expect(nodemailerService.sendEmail).toHaveBeenCalledTimes(1);


    const userAfterResend = await userCollection.findOne({ email: regDto.email });
    expect(userAfterResend!.emailConfirmation.confirmationCode).not.toBe(oldCode);
  });

  it('✅ should confirm user registration', async () => {
    
    const userToConfirm = await userCollection.findOne({ email: regDto.email });
    const currentCode = userToConfirm!.emailConfirmation.confirmationCode;

    await request(app)
    .post(CONFIRMATION_PATH)
    .send({ code: currentCode })
    .expect(HttpStatus.NoContent)

    const confirmedUser = await userCollection.findOne({ email: regDto.email });
    expect(confirmedUser!.emailConfirmation.isConfirmed).toBe(true);
  });

});

  describe('Refresh Token & Logout Flow', () => {
  const app = express();
  setupApp(app);

  const adminToken = generateBasicAuthToken();

  const userDto = {
  login: 'refUser',
  password: 'validPassword123',
  email: 'refresh@email.com',
};

  let firstAccessToken = '';
  let firstRefreshCookie = '';
  let secondAccessToken = '';
  let secondRefreshCookie = '';

  // Хелпер: достаём строку "refreshToken=..." из заголовка Set-Cookie
  const extractRefreshCookie = (setCookieHeader: string[] | undefined): string => {
    const rawCookie = setCookieHeader?.find((c) => c.startsWith('refreshToken='));
    expect(rawCookie).toBeDefined();
    expect(rawCookie).toContain('HttpOnly');
    expect(rawCookie).toContain('Secure');
    return rawCookie!.split(';')[0]; // берём только "refreshToken=<jwt>"
  };

  // Пауза > 1 сек, чтобы у нового JWT поменялось поле iat (оно в секундах)
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);

    await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send(userDto)
      .expect(HttpStatus.Created);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('✅ should login and return accessToken + refreshToken cookie', async () => {
    const response = await request(app)
      .post(AUTH_LOGIN_PATH)
      .send({
        loginOrEmail: userDto.login,
        password: userDto.password,
      })
      .expect(HttpStatus.Ok);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });

    firstAccessToken = response.body.accessToken;
    firstRefreshCookie = extractRefreshCookie(response.get('Set-Cookie'));
  });

  it('✅ should refresh tokens and return a NEW pair', async () => {
    await delay(1100);

    const response = await request(app)
      .post(REFRESH_TOKEN_PATH)
      .set('Cookie', firstRefreshCookie)
      .expect(HttpStatus.Ok);

    expect(response.body).toEqual({
      accessToken: expect.any(String),
    });

    secondAccessToken = response.body.accessToken;
    secondRefreshCookie = extractRefreshCookie(response.get('Set-Cookie'));

    expect(secondAccessToken).not.toBe(firstAccessToken);
    expect(secondRefreshCookie).not.toBe(firstRefreshCookie);
  });

  it('✅ should allow access to /auth/me with the NEW accessToken', async () => {
    const response = await request(app)
      .get(AUTH_ME_PATH)
      .set('Authorization', `Bearer ${secondAccessToken}`)
      .expect(HttpStatus.Ok);

    expect(response.body).toEqual({
      email: userDto.email,
      login: userDto.login,
      userId: expect.any(String),
    });
  });

  it('❌ should return 401 when using OLD (blacklisted) refreshToken', async () => {
    await request(app)
      .post(REFRESH_TOKEN_PATH)
      .set('Cookie', firstRefreshCookie)
      .expect(HttpStatus.Unauthorized);
  });

  it('❌ should return 401 when refreshToken cookie is missing or invalid', async () => {
    await request(app)
      .post(REFRESH_TOKEN_PATH)
      .expect(HttpStatus.Unauthorized);

    await request(app)
      .post(REFRESH_TOKEN_PATH)
      .set('Cookie', 'refreshToken=invalid.token.value')
      .expect(HttpStatus.Unauthorized);
  });

  it('✅ should logout user and revoke current refreshToken', async () => {
    await request(app)
      .post(LOGOUT_PATH)
      .set('Cookie', secondRefreshCookie)
      .expect(HttpStatus.NoContent);
  });

  it('❌ should return 401 on refresh and logout with revoked token after logout', async () => {
    await request(app)
      .post(REFRESH_TOKEN_PATH)
      .set('Cookie', secondRefreshCookie)
      .expect(HttpStatus.Unauthorized);

    await request(app)
      .post(LOGOUT_PATH)
      .set('Cookie', secondRefreshCookie)
      .expect(HttpStatus.Unauthorized);
  });
});