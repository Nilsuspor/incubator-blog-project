import { Router } from "express";
import {  AUTH_ROUTES } from "../constant/auth.path";
import { loginHandler } from "./handlers/login-handler";
import { loginValidation } from "../adapters/auth.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validation-result.middleware";
import { accessTokenGuard } from "../middlewares/access.token.guard";
import { meHandler } from "./handlers/me-handler";
import { registrationHandler } from "./handlers/registration-handler";
import { activationUserHandler } from "./handlers/activation-user-handler";
import { resendEmailHandler } from "./handlers/resend-email-handler";
import { userInputDtoValidation } from "../../users/validation/user.input-dto.validation-middlewares";
import { emailResendingValidation } from "../validation/email-validation-dto";
import { codeValidation } from "../validation/code-dto-validation";


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

authRouter.post(AUTH_ROUTES.REGISTRATION,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    registrationHandler
)

authRouter.post(AUTH_ROUTES.CONFIRMATION,
    codeValidation,
    inputValidationResultMiddleware,
    activationUserHandler
)

authRouter.post(AUTH_ROUTES.RESEND_EMAIL,
    emailResendingValidation,
    inputValidationResultMiddleware,
    resendEmailHandler
)