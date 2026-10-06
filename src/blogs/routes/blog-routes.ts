import { Router } from "express";
import { BLOGS_ROUTES } from "../constants/blogs.path";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { blogInputDtoValidation } from "../validation/blog.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super_admin.guard.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { BlogSortFields } from "./input/blog-sort-field";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query-middleware";
import { getPostByBlogId } from "./handlers/get-posts-by-blog-id";
import { PostSortFields } from "../../posts/routes/input/post-sort-fields";

export const blogsRouter = Router({})

   blogsRouter.get(BLOGS_ROUTES.ROOT, 
    paginationAndSortingValidation(BlogSortFields),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    getBlogListHandler);

    blogsRouter.get(
      BLOGS_ROUTES.BY_ID,
       idValidation,
        inputValidationResultMiddleware, 
        getBlogHandler);
    
      blogsRouter.get(
      BLOGS_ROUTES.BLOG_POSTS,
       idValidation,
       paginationAndSortingValidation(PostSortFields),
        inputValidationResultMiddleware, 
        sanitizeQueryParams,
        getPostByBlogId);


   blogsRouter.post(
      BLOGS_ROUTES.ROOT, 
      superAdminGuardMiddleware,
      blogInputDtoValidation, 
      inputValidationResultMiddleware, 
      createBlogHandler);

    blogsRouter.put(
      BLOGS_ROUTES.BY_ID,
      superAdminGuardMiddleware,
       idValidation,
        blogInputDtoValidation, 
        inputValidationResultMiddleware,
        updateBlogHandler);

    blogsRouter.delete(
      BLOGS_ROUTES.BY_ID, 
      superAdminGuardMiddleware,
      idValidation, 
      inputValidationResultMiddleware, 
      deleteBlogHandler)