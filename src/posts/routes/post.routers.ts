import { Router } from "express";
import { POSTS_ROUTES } from "../constants/posts.path";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { getPostHandler as getPostHandler } from "./handlers/get-post.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";

export const postsRouter = Router({})

    postsRouter.get(POSTS_ROUTES.ROOT, getPostListHandler);

    postsRouter.get(POSTS_ROUTES.BY_ID, getPostHandler);

    postsRouter.post(POSTS_ROUTES.ROOT, createPostHandler);

    postsRouter.put(POSTS_ROUTES.BY_ID, updatePostHandler);

    postsRouter.delete(POSTS_ROUTES.BY_ID, deletePostHandler)