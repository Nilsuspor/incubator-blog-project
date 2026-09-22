import { Router } from "express";
import { POSTS_ROUTES } from "../constants/posts.path";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { getPostHandler } from "./handlers/get-post.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { postInputDtoValidation } from "../validation/post.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";


export const postsRouter = Router({})

    postsRouter.get(
        POSTS_ROUTES.ROOT, 
        getPostListHandler);

    postsRouter.get(
        POSTS_ROUTES.BY_ID,
        idValidation, 
        inputValidationResultMiddleware, 
        getPostHandler);

    postsRouter.post(POSTS_ROUTES.ROOT,
        postInputDtoValidation, 
        inputValidationResultMiddleware, 
        createPostHandler);

    postsRouter.put(
        POSTS_ROUTES.BY_ID, 
        idValidation, 
        postInputDtoValidation,
        inputValidationResultMiddleware, 
        updatePostHandler);

    postsRouter.delete(POSTS_ROUTES.BY_ID, 
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler)