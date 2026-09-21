import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { getBlogViewModel } from "../../blog.mapper";


export function getBlogListHandler(req: Request, res: Response){
    res.status(HttpStatus.Ok).send(blogsRepository.FindAllBlogs().map(getBlogViewModel));
}