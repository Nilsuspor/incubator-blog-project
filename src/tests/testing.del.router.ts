import { Router } from "express";
import { Request, Response } from 'express';
import { HttpStatus } from "../core/types/http-statuses";
import { db } from "../db/in_memory.db";

export const testDelRouter = Router({})
  testDelRouter.delete("/testing/all-data", (req: Request, res: Response) => {
  db.posts = [];
  db.blogs = [];
  res.sendStatus(HttpStatus.NoContent);
  })