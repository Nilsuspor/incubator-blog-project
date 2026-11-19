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

describe('Comments API - Negative Flow (403, 404)', () => {
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

    // Тот самый хелпер с короткими логинами, чтобы пролезать в валидацию (max 10 символов)
    const createUserAndComment = async (userSuffix: string) => {
        const rand = Math.floor(Math.random() * 90000) + 10000; 
        const loginStr = `n${rand}`; // Например: n48291
        const emailStr = `neg${rand}@mail.com`;
        
        const userRes = await request(app)
            .post('/users')
            .set('Authorization', adminToken)
            .send({ login: loginStr, password: 'password123', email: emailStr })
            .expect(HttpStatus.Created);

        const loginRes = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: loginStr, password: 'password123' })
            .expect(HttpStatus.Ok); 
            
        const accessToken = loginRes.body.accessToken;

        const blogRes = await request(app)
            .post('/blogs')
            .set('Authorization', adminToken)
            .send({
                name: `NBlog${rand}`,
                description: 'Test neg blog description',
                websiteUrl: `https://neg${rand}.com`
            })
            .expect(HttpStatus.Created);

        const postRes = await request(app)
            .post('/posts')
            .set('Authorization', adminToken)
            .send({
                title: `NPost${rand}`,
                shortDescription: 'Short desc',
                content: 'Post content here',
                blogId: blogRes.body.id
            })
            .expect(HttpStatus.Created);

        const commentRes = await request(app)
            .post(`${POSTS_PATH}/${postRes.body.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: `This is a valid negative comment by ${loginStr} 1234` })
            .expect(HttpStatus.Created); 

        return { accessToken, commentId: commentRes.body.id };
    };

    it('🛑 should return 404 for non-existing comment; GET /comments/:id', async () => {
        const fakeMongoId = '609b4a45a300000000000000';
        await request(app)
            .get(`${COMMENTS_PATH}/${fakeMongoId}`)
            .expect(HttpStatus.NotFound);
    });

    it('🛑 should return 403 when trying to update someone else\'s comment; PUT /comments/:id', async () => {
        // Создаем коммент от владельца
        const owner = await createUserAndComment('ownerPUT');
        
        // Создаем ВТОРОГО юзера (хакера)
        const hacker = await createUserAndComment('hackerPUT');

        // Пытаемся обновить чужой коммент
        await request(app)
            .put(`${COMMENTS_PATH}/${owner.commentId}`)
            .set('Authorization', `Bearer ${hacker.accessToken}`) 
            .send({ content: 'I am a hacker trying to change this' })
            .expect(HttpStatus.Forbidden); // Ожидаем 403
    });

    it('🛑 should return 403 when trying to delete someone else\'s comment; DELETE /comments/:id', async () => {
        // Создаем коммент от владельца
        const owner = await createUserAndComment('ownerDEL');
        
        // Создаем ВТОРОГО юзера (хакера)
        const hacker = await createUserAndComment('hackerDEL');

        // Пытаемся удалить чужой коммент
        await request(app)
            .delete(`${COMMENTS_PATH}/${owner.commentId}`)
            .set('Authorization', `Bearer ${hacker.accessToken}`) 
            .expect(HttpStatus.Forbidden); // Ожидаем 403
    });
});