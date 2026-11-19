import request from 'supertest';
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { POSTS_PATH } from '../../posts/constants/posts.path';
import { HttpStatus } from '../../core/types/http-statuses';

const COMMENTS_PATH = '/comments'; 

describe('Comments API - Positive Flow', () => {
    const app = express();
    setupApp(app);
    
    const adminToken = generateBasicAuthToken();

    beforeEach(async () => { 
        await clearDb(app); 
    });
    
    beforeAll(async () => {
        await runDB(SETTINGS.MONGO_URL);
    });

    afterAll(async () => {
        await stopDb(); 
    });

const createUserAndComment = async (userSuffix: string) => {
        // Генерируем короткий рандом (5 цифр), чтобы уложиться в лимиты логина (min 3, max 10)
        const rand = Math.floor(Math.random() * 90000) + 10000; 
        const loginStr = `u${rand}`; // Например: u48291
        const emailStr = `test${rand}@mail.com`;
        
        // 1. Создаем уникального юзера
        const userRes = await request(app)
            .post('/users')
            .set('Authorization', adminToken)
            .send({ login: loginStr, password: 'password123', email: emailStr })
            .expect(HttpStatus.Created);

        // 2. Логинимся
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: loginStr, password: 'password123' })
            .expect(HttpStatus.Ok); 
            
        const accessToken = loginRes.body.accessToken;

        // 3. Создаем УНИКАЛЬНЫЙ блог
        const blogRes = await request(app)
            .post('/blogs')
            .set('Authorization', adminToken)
            .send({
                name: `Blog${rand}`,
                description: 'Test blog desc',
                websiteUrl: `https://test${rand}.com`
            })
            .expect(HttpStatus.Created);

        // 4. Создаем УНИКАЛЬНЫЙ пост внутри этого блога
        const postRes = await request(app)
            .post('/posts')
            .set('Authorization', adminToken)
            .send({
                title: `Post${rand}`,
                shortDescription: 'Short desc',
                content: 'Post content here',
                blogId: blogRes.body.id
            })
            .expect(HttpStatus.Created);

        // 5. Создаем коммент
        const commentContent = `This is a valid comment by ${loginStr} 12345`;
        const commentRes = await request(app)
            .post(`${POSTS_PATH}/${postRes.body.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: commentContent })
            .expect(HttpStatus.Created); 

        return {
            userId: userRes.body.id,
            accessToken,
            postId: postRes.body.id,
            commentId: commentRes.body.id,
            commentBody: commentRes.body
        };
    };

    it('✅ should return comment by id; GET /comments/:id', async () => {
        const { commentId, commentBody } = await createUserAndComment('get');

        const getRes = await request(app)
            .get(`${COMMENTS_PATH}/${commentId}`)
            .expect(HttpStatus.Ok);

        expect(getRes.body).toEqual(commentBody);
    });

    it('✅ should update own comment; PUT /comments/:id', async () => {
        const { commentId, accessToken } = await createUserAndComment('put');
        const newContent = 'This is an updated comment content string';

        await request(app)
            .put(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: newContent })
            .expect(HttpStatus.NoContent);

        const getRes = await request(app)
            .get(`${COMMENTS_PATH}/${commentId}`)
            .expect(HttpStatus.Ok);

        expect(getRes.body.content).toBe(newContent);
    });

    it('✅ should delete own comment and return 404 after; DELETE /comments/:id', async () => {
        const { commentId, accessToken } = await createUserAndComment('del');

        await request(app)
            .delete(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.NoContent);

        await request(app)
            .get(`${COMMENTS_PATH}/${commentId}`)
            .expect(HttpStatus.NotFound);
    });
});