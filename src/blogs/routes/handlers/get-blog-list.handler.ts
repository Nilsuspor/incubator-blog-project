import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { getBlogViewModel } from "../../blog.mapper";


export async function getBlogListHandler(req: Request, res: Response){

try {
   const blogs = await blogsRepository.FindAllBlogs()
   const blogsViewModels = blogs.map(getBlogViewModel)
   res.send(blogsViewModels)
}
catch{
   res.sendStatus(HttpStatus.InternalServerError)
}
  
}


