import jwt, { SignOptions } from "jsonwebtoken";
import { SETTINGS } from "../../settings/config";


export const jwtServiсe = {
    async createToken(userId: string):Promise<string>{
        return jwt.sign({userId}, SETTINGS.JWT_SECRET, {
            expiresIn: SETTINGS.JWT_EXPIRES_IN as SignOptions["expiresIn"]
        })
    },

    async decodeToken(token: string):Promise<any>{
        try{
        return jwt.decode(token);
        } catch (e:unknown){
            console.error("Can't decode token", e)
            return null
        }        
    },

    async verifyToken(token:string):Promise<{userId:string}| null>{
        try{
            return jwt.verify(token, SETTINGS.JWT_SECRET) as {userId:string}
        } catch (error){
            console.error("Token verify some error")
            return null
        }
    }

}