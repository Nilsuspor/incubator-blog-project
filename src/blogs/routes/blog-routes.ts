import { Router } from "express";
import { BLOGS_ROUTES } from "../constants/blogs.path";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";

export const blogsRouter = Router({})

   blogsRouter.get(BLOGS_ROUTES.ROOT, getBlogListHandler);

    blogsRouter.get(BLOGS_ROUTES.BY_ID, getBlogHandler);

   blogsRouter.post(BLOGS_ROUTES.ROOT, createBlogHandler);

    blogsRouter.put(BLOGS_ROUTES.BY_ID, updateBlogHandler);

    blogsRouter.delete(BLOGS_ROUTES.BY_ID, deleteBlogHandler)