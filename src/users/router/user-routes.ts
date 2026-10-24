import { Router } from "express";
import {  USERS_ROUTES } from "../constants/users.path";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation.middleware";
import { UserSortFields } from "./input/user-sort-field";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { sanitizeQueryParams } from "../../core/middlewares/validation/sanitize-query-middleware";
import { getUserListHandler } from "./handlers/get-user-list-handler";
import { deleteUserHandler } from "./handlers/delete-user.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation.middleware";
import { createUserHandler } from "./handlers/create-user-handler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super_admin.guard.middleware";
import { userInputDtoValidation } from "../validation/user.input-dto.validation-middlewares";
import { use } from "../../core/utils/express-utils";

export const userRouter = Router({})

userRouter.get(USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortFields),
    inputValidationResultMiddleware,
    sanitizeQueryParams,
    use(getUserListHandler)
)

userRouter.post(USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    createUserHandler
)

userRouter.delete(USERS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler
)