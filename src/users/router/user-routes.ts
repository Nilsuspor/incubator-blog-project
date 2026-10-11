import { Router } from "express";
import {  USERS_ROUTES } from "../constants/users.path";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { UserSortFields } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query-middleware";
import { getUserListHandler } from "./handlers/get-user-list-handler";

export const userRouter = Router({})

userRouter.get(USERS_ROUTES.ROOT,
    paginationAndSortingValidation(UserSortFields),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    getUserListHandler
)

//userRouter.post(USERS_ROUTES.ROOT)

//userRouter.delete(USERS_ROUTES.BY_ID)