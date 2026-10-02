import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogViewModel } from "../../dto/blog.view.model";
import { BlogService } from "../../application/blogs.servise";

export async function getBlogListHandler(req: Request, res: Response<BlogViewModel[]>){

try {
   const allBlogs = await BlogService.FindAllBlogsServise()
   res.status(HttpStatus.Ok).send(allBlogs)
}
catch{
   res.sendStatus(HttpStatus.InternalServerError)
}
  
}


