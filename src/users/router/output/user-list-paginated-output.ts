import { UserViewModel } from "../../dto/user.view.model";

export function buildUserPagination(
    items: UserViewModel[],
    totalCount: number, 
    pageNumber: number, 
    pageSize: number
){
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
    items: items
  };
}