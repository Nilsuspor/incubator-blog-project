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

})