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
import { getBlogById } from '../utils/blogs/get-blog-by-id';
export {};

describe('/blogs',()=>{
    const app = express();
  setupApp(app);
   const correctTestBlogData:BlogInputDto = getBlogDTO()

    const adminToken = generateBasicAuthToken();

  
  beforeAll(async ()=>{
    
    await runDB(SETTINGS.MONGO_URL)
    await clearDb(app)
  })

  afterAll(async () => {
    await stopDb();
  });

it('should not create blog when incorret body passed; POST /drivers', async ()=>{
    await request(app)
    .post(BLOGS_PATH)
    .send(correctTestBlogData)
    .expect(HttpStatus.Unauthorized)


const invalidDataSet1 = await request(app)
.post(BLOGS_PATH)
.set('Authorization', generateBasicAuthToken())
.send({
  name: '   ',
  description: '   ',
  websiteUrl: 'mysite.ru'
})
.expect(HttpStatus.BadRequest)

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);


 const blogListResponse = await request(app)
 .get(BLOGS_PATH)
 .set('Authorization', adminToken)   
 expect(blogListResponse.body).toHaveLength(0)

})


it('should not update blog when incorrect data passed; PUT blogs/:id', async () => {
    const createdBlog = await createBlog(app, correctTestBlogData);

    const invalidDataSet1 = await request(app)
      .put(`${BLOGS_PATH}/${createdBlog.id}`)
      .set('Authorization', generateBasicAuthToken())
      .send({
       name: '   ',
      description: '   ',
      websiteUrl: 'mysite.ru'
      })
      .expect(HttpStatus.BadRequest);

    expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);

      const blogResponse = await getBlogById(app, createdBlog.id)
      expect(blogResponse).toEqual({
        ...createdBlog
      })

    })


})