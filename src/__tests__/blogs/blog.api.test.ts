import request from 'supertest'
import express from 'express';
import { setupApp } from '../../setup-app';
import { stopDb, runDB } from '../../db/mongo.db';
import { SETTINGS } from '../../settings/config';
import { createBlog } from '../utils/blogs/create-blog';
import { BlogInputDto } from '../../blogs/dto/blog.input.dto';
import { getBlogDTO } from '../utils/blogs/get-blog-dto';
import { generateBasicAuthToken } from '../utils/generate-admin-auth-token';
import { clearDb } from '../utils/clear-db';
import { BLOGS_PATH } from '../../blogs/constants/blogs.path';
import { HttpStatus } from '../../core/types/http-statuses';
import { updateBlog } from '../utils/blogs/update-blog';
import { getBlogById } from '../utils/blogs/get-blog-by-id';

describe('/blogs',()=>{
    const app = express();
  setupApp(app);
   
    const adminToken = generateBasicAuthToken();

  
  beforeAll(async ()=>{
    
    await runDB(SETTINGS.MONGO_URL)
    await clearDb(app)
  })

    afterAll(async () => {
    await stopDb(); 
  });

    it('✅should return 200 and empty object', async()=>{
        await request(app)
        .get('/blogs')
        .expect(200, {pagesCount: 0, 
        page: 1, 
        pageSize: 10, 
        totalCount: 0, 
         items: []
})
    })

    it('✅ should create blog; POST /blogs', async()=>{
       const newBlog : BlogInputDto = {...getBlogDTO(), name: 'Adolf2'}
       
       await createBlog(app, newBlog)
       
    })

    it('✅should return blogs list GET /blogs', async()=>{
        await createBlog(app);
        await createBlog(app)

        const response = await request(app)
        .get(BLOGS_PATH)
        .set('Authorization', adminToken)
        .expect(HttpStatus.Ok)

        expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    })

    it ('✅should return blog by id; GET /blogs/:id', async ()=>{
      const createdBlog = await createBlog(app)
      
      const blog = await getBlogById(app,  createdBlog.id)

      expect(blog).toEqual(createdBlog)

    })


    it('✅should update blog; PUT /blogs/:id', async()=>{
      const createdBlog = await createBlog(app)

      const blogUpdateData:BlogInputDto ={
        name: 'Ruus',
        description: 'Ruus blog',
        websiteUrl: 'https://ruus-blog.com'
      }

      await updateBlog(app, createdBlog.id, blogUpdateData)

      const blogResponse = await getBlogById(app, createdBlog.id)

      expect(blogResponse).toEqual({
        id: createdBlog.id,
        name: blogUpdateData.name,
        description: blogUpdateData.description,
        websiteUrl: blogUpdateData.websiteUrl,
        createdAt: createdBlog.createdAt,
        isMembership: expect.any(Boolean)
      })

    })

   it('✅should delete blog and check after "NOT FOUND"; DELETE /blogers/:id', async()=>{
      const createdBlog = await createBlog(app)

      await request(app)
      .delete(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent)

      await request(app)
      .get(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound)

   }) 

describe('Nested endpoints: /blogs/:id/posts', () => {
    
    it('✅ should return 404 if blog does not exist; POST /blogs/:id/posts', async () => {
      const fakeMongoId = '6ac4f8c9c8ed4d1f039eafa5'; // Валидный по формату, но несуществующий ID
      
      await request(app)
        .post(`${BLOGS_PATH}/${fakeMongoId}/posts`)
        .set('Authorization', adminToken)
        .send({
          title: 'Valid title',
          shortDescription: 'Valid short desc',
          content: 'Valid content'
        })
        .expect(HttpStatus.NotFound);
    });

    it('✅ should return 400 if post data is invalid; POST /blogs/:id/posts', async () => {
      const createdBlog = await createBlog(app);
      
      await request(app)
        .post(`${BLOGS_PATH}/${createdBlog.id}/posts`)
        .set('Authorization', adminToken)
        .send({
          title: '', // Ошибка: пустое поле
          shortDescription: 'short desc',
          content: 'content'
        })
        .expect(HttpStatus.BadRequest);
    });

    it('✅ should create a post for specific blog; POST /blogs/:id/posts', async () => {
      const createdBlog = await createBlog(app);
      const postData = {
        title: 'New Post Title',
        shortDescription: 'Very interesting post',
        content: 'This is the main content of the post'
      };

      const response = await request(app)
        .post(`${BLOGS_PATH}/${createdBlog.id}/posts`)
        .set('Authorization', adminToken)
        .send(postData)
        .expect(HttpStatus.Created);

      // Проверяем, что вернулся правильный объект поста (включая blogName из БД)
      expect(response.body).toEqual({
        id: expect.any(String),
        title: postData.title,
        shortDescription: postData.shortDescription,
        content: postData.content,
        blogId: createdBlog.id,
        blogName: createdBlog.name,
        createdAt: expect.any(String)
      });
    });

    it('✅ should return empty pagination object; GET /blogs/:id/posts', async () => {
      const createdBlog = await createBlog(app);

      await request(app)
        .get(`${BLOGS_PATH}/${createdBlog.id}/posts`)
        .expect(HttpStatus.Ok, {
          pagesCount: 0,
          page: 1,
          pageSize: 10,
          totalCount: 0,
          items: []
        });
    });

    it('✅ should return pagination with posts; GET /blogs/:id/posts', async () => {
      const createdBlog = await createBlog(app);
      
      // Создаем пост через API
      const postResponse = await request(app)
        .post(`${BLOGS_PATH}/${createdBlog.id}/posts`)
        .set('Authorization', adminToken)
        .send({
          title: 'Post 1',
          shortDescription: 'Desc 1',
          content: 'Content 1'
        })
        .expect(HttpStatus.Created);

      // Получаем список постов блога
      const getResponse = await request(app)
        .get(`${BLOGS_PATH}/${createdBlog.id}/posts`)
        .expect(HttpStatus.Ok);

      // Проверяем структуру пагинации и наличие созданного поста
      expect(getResponse.body.items).toBeInstanceOf(Array);
      expect(getResponse.body.items.length).toBe(1);
      expect(getResponse.body.items[0]).toEqual(postResponse.body);
      expect(getResponse.body.totalCount).toBe(1);
    });

  });

})