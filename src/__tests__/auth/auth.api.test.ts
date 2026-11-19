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