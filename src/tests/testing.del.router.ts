import { Router } from "express";
import { Request, Response } from 'express';
import { HttpStatus } from "../core/types/http-statuses";
import { blogCollection, commentCollection, postCollection, userCollection,revokedTokensCollection } from "../db/collections";


export const testDelRouter = Router({})

testDelRouter.delete("/", async(req: Request, res: Response) => {
    const postResult = await postCollection.deleteMany({});
    const blogResult = await blogCollection.deleteMany({});
    const userResult = await userCollection.deleteMany({})
    const commentResult = await commentCollection.deleteMany({})
    const tokenResult = await revokedTokensCollection.deleteMany({})
    
    console.log('Удалено постов:', postResult.deletedCount);
    console.log('Удалено блогов:', blogResult.deletedCount);
    console.log('Удалено пользователей:', userResult.deletedCount);
    console.log('Уделено комментариев', commentResult.deletedCount);
    console.log('Уделено токенов', tokenResult.deletedCount)
    res.sendStatus(HttpStatus.NoContent);
  })