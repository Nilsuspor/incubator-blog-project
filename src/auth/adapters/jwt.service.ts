import jwt, { SignOptions } from "jsonwebtoken";
import { SETTINGS } from "../../settings/config";
import { RefreshTokenPayload } from "../types/refreshTokenPayload";


export const jwtService = {
    async createToken(userId: string):Promise<string>{
        return jwt.sign({userId}, SETTINGS.JWT_SECRET, {
            expiresIn: SETTINGS.JWT_EXPIRES_IN as SignOptions["expiresIn"]
        })
    },

 async createRefreshToken(userId: string, deviceId: string): Promise<string> {
  return jwt.sign({ userId, deviceId }, SETTINGS.JWT_REFRESH_SECRET, {
    expiresIn: SETTINGS.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });
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
    },

async verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const payload = jwt.verify(
      token,
      SETTINGS.JWT_REFRESH_SECRET
    ) as Partial<RefreshTokenPayload>;

    if (!payload.userId || !payload.deviceId || !payload.iat || !payload.exp) {
      return null;
    }

    return {
      userId: payload.userId,
      deviceId: payload.deviceId,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    return null;
  }
},

decodeRefreshToken(token: string): RefreshTokenPayload | null {
  const payload = jwt.decode(token) as Partial<RefreshTokenPayload> | null;
  if (!payload?.userId || !payload?.deviceId || !payload?.iat || !payload?.exp) {
    return null;
  }

  return {
    userId: payload.userId,
    deviceId: payload.deviceId,
    iat: payload.iat,
    exp: payload.exp,
  };
},
}