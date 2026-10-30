import { BlogViewModel } from "../../dto/blog.view.model";


export function buildBlogPagination(
  items: BlogViewModel[], 
  totalCount: number, 
  pageNumber: number, 
  pageSize: number
) {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items
  };
}