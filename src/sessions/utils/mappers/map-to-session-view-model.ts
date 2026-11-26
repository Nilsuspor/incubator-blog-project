import { WithId } from "mongodb";
import { SessionDb } from "../../types/session";
import { SessionViewModel } from "../../dto/out/session.view.model";

export function mapToSessionViewModel(session:WithId<SessionDb>):SessionViewModel{
    return{
        ip: session.ip,
        title:session.title,
        lastActiveDate:session.lastActiveDate,
        deviceId:session.deviceId
    }
}