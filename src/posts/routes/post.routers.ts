import { Router } from "express";
import { POSTS_ROUTES } from "../constants/posts.path";
import { getPostListHandler } from "./handlers/get-post-list";
import { getPostHandler } from "./handlers/get-pos";
import { createPostHandler } from "./handlers/create-post";
import { updatePostHandler } from "./handlers/update-post";
import { deletePostHandler } from "./handlers/delete-post";
import { postInputDtoValidation } from "../validation/post.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super_admin.guard.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { PostSortFields } from "./input/post-sort-fields";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query-middleware";
import { use } from "../../core/utils/express-utils";
import { accessTokenGuard } from "../../auth/middlewares/access.token.guard";
import { createCommentForPostHandler } from "./handlers/create-comment-for-post";
import { getCommentsByBlogId } from "./handlers/get-comments-by-post-id";
import { CommentSortFields } from "../../comments/routes/input/comment-sort-fields";

export const postsRouter = Router({})

    postsRouter.get(
        POSTS_ROUTES.ROOT, 
        paginationAndSortingValidation(PostSortFields),
        inputValidationResultMiddleware,
        sanitizeQueryParams,    
        use(getPostListHandler));

    postsRouter.get(
        POSTS_ROUTES.BY_ID,
        getPostHandler);

    postsRouter.post(POSTS_ROUTES.ROOT,
        superAdminGuardMiddleware,
        postInputDtoValidation, 
        inputValidationResultMiddleware, 
        createPostHandler);

    postsRouter.put(
        POSTS_ROUTES.BY_ID, 
        superAdminGuardMiddleware,
        idValidation, 
        postInputDtoValidation,
        inputValidationResultMiddleware, 
        updatePostHandler);

    postsRouter.delete(POSTS_ROUTES.BY_ID, 
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deletePostHandler)

    postsRouter.post(POSTS_ROUTES.POST_COMMENTS,
        accessTokenGuard,
        createCommentForPostHandler
    )    

    postsRouter.get(POSTS_ROUTES.POST_COMMENTS,
        paginationAndSortingValidation(CommentSortFields),
        inputValidationResultMiddleware,
        sanitizeQueryParams,
        use(getCommentsByBlogId)
    )