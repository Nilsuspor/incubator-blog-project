import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { BlogQueryInput } from "../input/blog-query.input";
import { buildBlogPagination } from "../output/blog-list-paginated.output";
import { blogsQueryRepository } from "../../repository/blog.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function getBlogListHandler(req: Request, res: Response){

try {
   const queryInput = req.query as unknown as BlogQueryInput;

   const {mappedItems, totalCount} = await blogsQueryRepository.findMany(queryInput)


   const response = buildBlogPagination(
      mappedItems,
      totalCount,
      queryInput.pageNumber,
      queryInput.pageSize
   )
   res.status(HttpStatus.Ok).send(response)
}
catch (e: unknown) {
      errorsHandler(e, res);
}
  
}


