import { sessionsCollection } from "../../db/collections";
import { SessionDb } from "../types/session";
import { WithId } from 'mongodb';


export const sessionRepository = {
    async create(session: SessionDb): Promise<void> {
    await sessionsCollection.insertOne(session);
  },


  async findByDeviceId(deviceId: string): Promise<WithId<SessionDb> | null> {
    return sessionsCollection.findOne({ deviceId });
  },

  async updateSession(
    deviceId: string,
    lastActiveDate: string,
    expiresAt: Date
  ): Promise<boolean> {
    const result = await sessionsCollection.updateOne(
      { deviceId },
      { $set: { lastActiveDate, expiresAt } }
    );
    return result.matchedCount === 1;
  },

  async deleteByDeviceId(deviceId: string, userId: string): Promise<boolean> {
    const result = await sessionsCollection.deleteOne({ deviceId, userId });
    return result.deletedCount === 1;
  },
}