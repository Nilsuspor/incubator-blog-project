import express, { Express } from "express";
import { Request, Response } from 'express';
import {HttpStatus} from "./core/types/http-statuses";
import { blogsRouter } from "./blogs/routes/blog-routes";
import { postsRouter } from "./posts/routes/post.routers";
import { testDelRouter } from "./tests/testing.del.router";
import { BLOGS_PATH } from "./blogs/constants/blogs.path";
import { POSTS_PATH } from "./posts/constants/posts.path";
import { TESTING_PATH } from "./core/constants/testing.path";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  // основной роут
  app.get("/", (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send("Hello world!");
  });
  app.use(BLOGS_PATH, blogsRouter)
  app.use(POSTS_PATH, postsRouter)
  app.use (TESTING_PATH,testDelRouter)

  return app;

};