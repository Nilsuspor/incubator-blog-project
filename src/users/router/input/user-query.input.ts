import { PaginationAndSorting } from "../../../core/types/pagination-and-sorting";
import { UserSortFields } from "./user-sort-field";

export type UserQueryInput = PaginationAndSorting<UserSortFields> & Partial<{
  searchLoginTerm: string;
  searchEmailTerm: string;
}>;