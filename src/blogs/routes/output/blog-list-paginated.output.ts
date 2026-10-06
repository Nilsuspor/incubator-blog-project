import { Blog } from "../../types/blogs"


export function buildBlogPagination(
  items: Blog[], 
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