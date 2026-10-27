import { Router } from "express";
import {  AUTH_ROUTES } from "../constant/auth.path";
import { loginHandler } from "./handlers/login-handler";
import { loginValidation } from "../adapters/auth.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { accessTokenGuard } from "../middlewares/access.token.guard";
import { meHandler } from "./handlers/me-handler";


export const authRouter = Router({})

authRouter.post(AUTH_ROUTES.LOGIN,
    loginValidation,
    inputValidationResultMiddleware,
    loginHandler
)

authRouter.get(AUTH_ROUTES.ME,
    accessTokenGuard,
    meHandler
)