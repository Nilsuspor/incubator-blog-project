import { Router } from "express";
import {  AUTH_ROUTES } from "../constant/auth.path";
import { loginHandler } from "./login-handler";
import { loginValidation } from "../adapters/auth.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";

export const authRouter = Router({})

authRouter.post(AUTH_ROUTES.LOGIN,
    loginValidation,
    inputValidationResultMiddleware,
    loginHandler
)