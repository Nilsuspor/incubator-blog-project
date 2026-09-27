import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { blogsRepository } from "../../repository/blog.repository";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { BlogViewModel } from "../../dto/blog.view.model";


export async function getBlogListHandler(req: Request, res: Response<BlogViewModel[]>){

try {
   const blogs = await blogsRepository.FindAllBlogs()
   const blogsViewModels = blogs.map(mapToBlogViewModel)
   res.status(HttpStatus.Ok).send(blogsViewModels)
}
catch{
   res.sendStatus(HttpStatus.InternalServerError)
}
  
}


