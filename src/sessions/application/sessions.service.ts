import { Result } from "../../core/result/result.type"
import { sessionRepository } from "../repository/session.repository"
import { ResultStatus } from "../../core/result/resultCode"

export const sessionServices = {
    async deleteOtherSessions(
        userId:string,
        deviceId:string
    ): Promise<Result<null>>{
    await sessionRepository.deleteOtherSessions(userId, deviceId)
      return {
         status: ResultStatus.Success,
         data: null,
         extensions: [],
       };   
    },


    async deleteSessionByDeviceId(userId: string, deviceId: string): Promise<Result<null>> {
  const foundSession = await sessionRepository.findByDeviceId(deviceId);

  if (!foundSession) {
    return {
      status: ResultStatus.NotFound,
      data: null,
      extensions: [],
    };
  }

  if (foundSession.userId !== userId) {
    return {
      status: ResultStatus.Forbidden,
      data: null,
      extensions: [],
    };
  }

  await sessionRepository.deleteByDeviceId(deviceId, userId);

  return {
    status: ResultStatus.Success,
    data: null,
    extensions: [],
  };
}

}
