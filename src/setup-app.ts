import express, { Express } from "express";
import { Request, Response } from 'express';
import {HttpStatus} from "./core/types/http-statuses";


import { blogsRouter } from "./blogs/routes/blog-routes";
import { postsRouter } from "./posts/routes/post.routers";
import { testDelRouter } from "./tests/testing.del.router";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
 
  // основной роут
  app.get("/", (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).send("Hello world!");
  });
  app.use('/blogs', blogsRouter)
  app.use('/posts', postsRouter)
  app.use ('/testing/all-data',testDelRouter)

  return app;

};