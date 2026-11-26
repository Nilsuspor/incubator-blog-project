import { sessionsCollection } from "../../db/collections";
import { SessionViewModel } from "../dto/out/session.view.model"
import { mapToSessionViewModel } from "../utils/mappers/map-to-session-view-model";

export const sessionQueryRepository = {
    async findSessions(userId:string):Promise<SessionViewModel[]>{

        const userSessions = await sessionsCollection.find({ userId: userId }).toArray();

        return userSessions.map(session=>mapToSessionViewModel(session))
    }
}