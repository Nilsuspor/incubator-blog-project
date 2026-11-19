import { revokedTokensCollection } from "../../db/collections";


export const authRepository = {
    async addToBlacklist(token:string):Promise<string>{
        const insertResult = await revokedTokensCollection.insertOne({ token })
        return insertResult.insertedId.toString()
    },

    async isTokenInBlackList(token:string):Promise<boolean>{
        const foundToken = await revokedTokensCollection.findOne({token:token})
        return !!foundToken

    }
}