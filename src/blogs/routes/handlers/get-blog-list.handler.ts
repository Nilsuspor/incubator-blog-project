import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogServices } from "../../application/blogs.servise";
import { BlogQueryInput } from "../input/blog-query.input";
import { mapToBlogViewModel } from "../mappers/map-to-blog-view-model.util";
import { buildBlogPagination } from "../output/blog-list-paginated.output";



export async function getBlogListHandler(req: Request, res: Response){

try {
   const queryInput = req.query as unknown as BlogQueryInput;

   const {items, totalCount} = await BlogServices.findMany(queryInput)

   const mappedBlogs = items.map(blog => mapToBlogViewModel(blog))

   const response = buildBlogPagination(
      mappedBlogs,
      totalCount,
      queryInput.pageNumber,
      queryInput.pageSize
   )
   res.status(HttpStatus.Ok).send(response)
}
catch (e: unknown) { 
   console.log('🚨 ОШИБКА В ХЕНДЛЕРЕ БЛОГОВ:', e); 
   res.sendStatus(HttpStatus.InternalServerError);
}
  
}


