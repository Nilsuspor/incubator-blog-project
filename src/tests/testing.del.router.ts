import { Router } from "express";
import { Request, Response } from 'express';
import { HttpStatus } from "../core/types/http-statuses";
import { blogCollection, postCollection } from "../db/collections";


export const testDelRouter = Router({})

testDelRouter.delete("/", async(req: Request, res: Response) => {
    const postResult = await postCollection.deleteMany({});
    const blogResult = await blogCollection.deleteMany({});
    
    console.log('Удалено постов:', postResult.deletedCount);
    console.log('Удалено блогов:', blogResult.deletedCount);
    
    res.sendStatus(HttpStatus.NoContent);
  })