import { Router } from "express";
import { SECURITY_ROUTES } from "../constants/security.path";
import { refreshTokenGuard } from "../../auth/middlewares/refresh-token.guard.middleware";
import { getActiveSessionsHandler } from "./handlers/get-active-sessions.handler";
import { deleteOtherSessionsHandler } from "./handlers/delete-other-sessions.handler";
import { deleteSessionByDeviceIdHandler } from "./handlers/delete-session-by-id.handler";

export const sessionsRouter = Router({})

sessionsRouter.get(SECURITY_ROUTES.DEVICES,
    refreshTokenGuard,
    getActiveSessionsHandler
)

sessionsRouter.delete(SECURITY_ROUTES.DEVICES,
    refreshTokenGuard,
    deleteOtherSessionsHandler
)

sessionsRouter.delete(SECURITY_ROUTES.DEVICE_BY_ID,
    refreshTokenGuard,
    deleteSessionByDeviceIdHandler
)