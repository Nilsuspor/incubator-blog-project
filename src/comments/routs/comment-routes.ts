import { Router } from "express";
import { COMMENTS_ROUTES } from "../constants/comment.path";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { getCommentHandler } from "./handlers/get-comment.handler";

export const commentRourter = Router({})

    commentRourter.get(COMMENTS_ROUTES.BY_ID,
        
        getCommentHandler
    )