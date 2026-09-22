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


export const blogsRouter = Router({})

   blogsRouter.get(BLOGS_ROUTES.ROOT, getBlogListHandler);

    blogsRouter.get(
      BLOGS_ROUTES.BY_ID,
       idValidation,
        inputValidationResultMiddleware, 
        getBlogHandler);
    

   blogsRouter.post(
      BLOGS_ROUTES.ROOT, 
      blogInputDtoValidation, 
      inputValidationResultMiddleware, 
      createBlogHandler);

    blogsRouter.put(
      BLOGS_ROUTES.BY_ID,
       idValidation,
        blogInputDtoValidation, 
        inputValidationResultMiddleware,
        updateBlogHandler);

    blogsRouter.delete(
      BLOGS_ROUTES.BY_ID, 
      idValidation, 
      inputValidationResultMiddleware, 
      deleteBlogHandler)