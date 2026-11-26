
import { SessionViewModel } from "../../dto/out/session.view.model";
import { Response, Request } from "express";
import { sessionQueryRepository } from "../../repository/session.query.repository";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";


export async function getActiveSessionsHandler(
    req: Request,
    res: Response<SessionViewModel[]>    
) {
try {
    const userId = req.user?.id;
     if (!userId) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
    const activeSessions = await sessionQueryRepository.findSessions(userId)
    res.status(HttpStatus.Ok).send(activeSessions)
}catch (e:unknown){
    errorsHandler(e, res)
}

    
}