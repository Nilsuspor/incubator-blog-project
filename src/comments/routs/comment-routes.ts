import { Router } from "express";
import { COMMENTS_ROUTES } from "../constants/comment.path";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getCommentHandler } from "./handlers/get-comment.handler";
import { updateCommentHandler } from "./handlers/update-comment.handler";
import { accessTokenGuard } from "../../auth/middlewares/access.token.guard";
import { commentInputDtoValidation } from "../validation/comment,input-dto.validation-middlewares";
import { deleteCommentHandler } from "./handlers/delete-comment.handler";

export const commentRourter = Router({})

    commentRourter.get(COMMENTS_ROUTES.BY_ID,
        idValidation,
        inputValidationResultMiddleware,
        getCommentHandler
    )

    commentRourter.put(COMMENTS_ROUTES.BY_ID,
        accessTokenGuard,
        idValidation,
        commentInputDtoValidation,
        inputValidationResultMiddleware,
        updateCommentHandler
    )

    commentRourter.delete(COMMENTS_ROUTES.BY_ID,
        accessTokenGuard,
        idValidation,
        inputValidationResultMiddleware,
        deleteCommentHandler
    )
