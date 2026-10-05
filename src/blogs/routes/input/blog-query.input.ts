// 1. Импортируем твой базовый чертеж пагинации
import { PaginationAndSorting } from "../../../core/types/pagination-and-sorting";
import { BlogSortFields } from "./blog-sort-field";


export type BlogQueryInput = PaginationAndSorting<BlogSortFields> & Partial<{
  searchNameTerm: string;
}>;