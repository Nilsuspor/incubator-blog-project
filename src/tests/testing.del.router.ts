import { Router } from "express";
import { Request, Response } from 'express';
import { HttpStatus } from "../core/types/http-statuses";
import { blogCollection, postCollection, userCollection } from "../db/collections";


export const testDelRouter = Router({})

testDelRouter.delete("/", async(req: Request, res: Response) => {
    const postResult = await postCollection.deleteMany({});
    const blogResult = await blogCollection.deleteMany({});
    const userResult = await userCollection.deleteMany({})
    
    console.log('Удалено постов:', postResult.deletedCount);
    console.log('Удалено блогов:', blogResult.deletedCount);
    console.log('Удалено пользователей:', userResult.deletedCount);
    res.sendStatus(HttpStatus.NoContent);
  })