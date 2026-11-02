import request from 'supertest';
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { clearDb } from '../utils/clear-db';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { createPost } from '../utils/posts/create-post';
import { POSTS_PATH } from '../../posts/constants/posts.path';
import { HttpStatus } from '../../core/types/http-statuses';

// Убедись, что путь к константам правильный
const COMMENTS_PATH = '/comments'; 

describe('/comments', () => {
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

    // --- ЛОКАЛЬНЫЙ ХЕЛПЕР ---
    // Создает юзера, логинится, создает пост и коммент. Возвращает всё, что нужно для тестов.
    const createUserAndComment = async (userLogin: string) => {
        // 1. Создаем юзера
        const userRes = await request(app)
            .post('/users')
            .set('Authorization', adminToken)
            .send({ login: userLogin, password: 'password123', email: `${userLogin}@test.com` });

        // 2. Логинимся
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: userLogin, password: 'password123' });
        const accessToken = loginRes.body.accessToken;

        // 3. Создаем пост
        const post = await createPost(app);

        // 4. Создаем коммент
        const commentContent = `This is a valid comment by ${userLogin} 12345`; // Точно больше 20 символов
        const commentRes = await request(app)
            .post(`${POSTS_PATH}/${post.id}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: commentContent });

        return {
            userId: userRes.body.id,
            accessToken,
            postId: post.id,
            commentId: commentRes.body.id,
            commentBody: commentRes.body // полный объект коммента
        };
    };

    // --- ТЕСТЫ ---

    it('✅ should return comment by id; GET /comments/:id', async () => {
        const { commentId, commentBody } = await createUserAndComment('userGET');

        const getRes = await request(app)
            .get(`${COMMENTS_PATH}/${commentId}`)
            .expect(HttpStatus.Ok);

        expect(getRes.body).toEqual(commentBody);
    });

    it('🛑 should return 404 for non-existing comment; GET /comments/:id', async () => {
        const fakeMongoId = '609b4a45a300000000000000';
        await request(app)
            .get(`${COMMENTS_PATH}/${fakeMongoId}`)
            .expect(HttpStatus.NotFound);
    });

    it('✅ should update own comment; PUT /comments/:id', async () => {
        const { commentId, accessToken } = await createUserAndComment('userPUT');
        
        const newContent = 'This is an updated comment content string';

        // 1. Обновляем
        await request(app)
            .put(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ content: newContent })
            .expect(HttpStatus.NoContent);

        // 2. Проверяем, что реально обновилось
        const getRes = await request(app)
            .get(`${COMMENTS_PATH}/${commentId}`)
            .expect(HttpStatus.Ok);

        expect(getRes.body.content).toBe(newContent);
    });

    it('🛑 should return 403 when trying to update someone else\'s comment; PUT /comments/:id', async () => {
        // Создаем коммент от первого юзера
        const owner = await createUserAndComment('ownerPUT');
        
        // Создаем ВТОРОГО юзера (чужака) и берем только его токен
        const hacker = await createUserAndComment('hackerPUT');

        // Пытаемся обновить чужой коммент
        await request(app)
            .put(`${COMMENTS_PATH}/${owner.commentId}`)
            .set('Authorization', `Bearer ${hacker.accessToken}`) // Токен чужака!
            .send({ content: 'I am a hacker trying to change this' })
            .expect(HttpStatus.Forbidden); // Ожидаем 403
    });

    it('🛑 should return 403 when trying to delete someone else\'s comment; DELETE /comments/:id', async () => {
        // Создаем коммент от первого юзера
        const owner = await createUserAndComment('ownerDEL');
        
        // Создаем ВТОРОГО юзера
        const hacker = await createUserAndComment('hackerDEL');

        // Пытаемся удалить чужой коммент
        await request(app)
            .delete(`${COMMENTS_PATH}/${owner.commentId}`)
            .set('Authorization', `Bearer ${hacker.accessToken}`) // Токен чужака!
            .expect(HttpStatus.Forbidden); // Ожидаем 403
    });

    it('✅ should delete own comment and return 404 after; DELETE /comments/:id', async () => {
        const { commentId, accessToken } = await createUserAndComment('userDeleteOk');

        // 1. Владелец удаляет свой коммент
        await request(app)
            .delete(`${COMMENTS_PATH}/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(HttpStatus.NoContent);

        // 2. Проверяем, что его больше нет в базе
        await request(app)
            .get(`${COMMENTS_PATH}/${commentId}`)
            .expect(HttpStatus.NotFound);
    });
});