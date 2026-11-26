import { Result } from "../../core/result/result.type";
import { userRepository } from "../../users/repository/user.repository"
import { bcryptService } from "../adapters/bcrypt.service";
import { ResultStatus } from "../../core/result/resultCode";
import { jwtService } from "../adapters/jwt.service";
import { User } from "../../users/types/user";
import { WithId } from "mongodb";
import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emailExamples";
import { RegistrationDto } from "../dto/registration.dto";
import { createUserEntity } from "../../users/types/user.factory";
import { sessionRepository } from "../../sessions/repository/session.repository";

export const AuthServices = {
    async loginUser(
        loginOrEmail:string,
        password:string,
        ip: string,
        title: string
    ):Promise<Result<{accessToken:string, refreshToken:string}|null>>{
        const result = await AuthServices.checkUserCredentials(loginOrEmail, password);
        if (result.status !== ResultStatus.Success || !result.data)
            return {
            status: ResultStatus.Unauthorized,
            errorMessage: 'Unauthorized',
            extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
            data: null,
      };
        const userId = result.data._id.toString();
        const deviceId = randomUUID();

        const accessToken = await jwtService.createToken(userId);
        const refreshToken = await jwtService.createRefreshToken(userId, deviceId);

        const payload = jwtService.decodeRefreshToken(refreshToken);
        if (!payload) {
          throw new Error('Failed to decode newly created refresh token');
  }

  await sessionRepository.create({
    userId,
    deviceId,
    ip,
    title,
    lastActiveDate: new Date(payload.iat * 1000).toISOString(),
    expiresAt: new Date(payload.exp * 1000),
  });
       return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };

    },


async refreshUserTokens(
  userId: string,
  deviceId: string
): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return {
      status: ResultStatus.Unauthorized,
      errorMessage: 'Unauthorized',
      extensions: [{ field: 'refreshToken', message: 'User not found' }],
      data: null,
    };
  }

  const accessToken = await jwtService.createToken(userId);
  const refreshToken = await jwtService.createRefreshToken(userId, deviceId);

  const payload = jwtService.decodeRefreshToken(refreshToken);
  if (!payload) {
    throw new Error('Failed to decode newly created refresh token');
  }

  await sessionRepository.updateSession(
    deviceId,
    new Date(payload.iat * 1000).toISOString(),
    new Date(payload.exp * 1000)
  );

  return {
    status: ResultStatus.Success,
    data: { accessToken, refreshToken },
    extensions: [],
  };
},
    async checkUserCredentials(loginOrEmail:string, password:string):Promise<Result<WithId<User> | null>>{
       const user = await userRepository.findByLoginOrEmail(loginOrEmail, loginOrEmail)
        if (!user) 
            return {
             status: ResultStatus.NotFound,
             data: null,
             errorMessage: 'Not Found',
             extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            }
        const isPasswordCorrect = await bcryptService.checkPassword(password, user.passwordHash)
        if (!isPasswordCorrect)
      return {
        status: ResultStatus.BadRequest,
        data: null,
        errorMessage: 'Bad Request',
        extensions: [{ field: 'password', message: 'Wrong password' }],
      }; 

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
},

async registerUser(dto: RegistrationDto): Promise<Result<null>> {
  const { login, email, password } = dto;
  const existingUser = await userRepository.findByLoginOrEmail(login, email);

  if (existingUser) {
    const field = existingUser.email === email ? 'email' : 'login';
    return {
      status: ResultStatus.BadRequest,
      data: null,
      errorMessage: 'Bad Request',
      extensions: [{ field, message: `User with this ${field} already exists` }],
    };
  }

  const passwordHash = await bcryptService.generateHash(password);
  const newUser = createUserEntity({
    login,
    email,
    passwordHash,
    isConfirmed: false,
  });

  await userRepository.create(newUser);

  nodemailerService
    .sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode,
      emailExamples.registrationEmail
    )
    .catch((er) => console.error('error in send email:', er));

  return {
    status: ResultStatus.Success,
    data: null,
    extensions: [],
  };
},

async confirmUser(code:string): Promise<Result<null>>{
  const user = await userRepository.findByConfirmationCode(code)
  if (!user) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'code', message: 'Code is incorrect' }],
    };
  }
if (user.emailConfirmation.isConfirmed) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'code', message: 'Email is already confirmed' }],
    };
  }
  if (user.emailConfirmation.expirationDate < new Date()) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'code', message: 'Confirmation code is expired' }],
    };
  }

  await userRepository.activateUser(user._id.toString())
  return {
    status: ResultStatus.Success,
    data: null,
    extensions: [],
  };
},

async emailResending(email:string): Promise<Result<null>>{
  const user = await userRepository.findByLoginOrEmail(email, email)
  if (!user) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'email', message: 'user not found' }],
    };
  }
  if (user.emailConfirmation.isConfirmed === true){
     return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'email', message: 'User has been activated' }],
    };
  }
  const newCode = randomUUID()
  const newExpDate = add(new Date(), {
        hours :1,
        minutes:30,
      })

  await userRepository.refreshCode(email, newCode, newExpDate)

    nodemailerService
  .sendEmail(
    user.email,
    newCode,
    emailExamples.registrationEmail,
  ).catch(er => console.error('error in send email:', er));
 return {
      status: ResultStatus.Success,
      data: null,
      extensions: [],
    };
      
}, 

async logOut(userId: string, deviceId: string): Promise<Result<null>> {
  await sessionRepository.deleteByDeviceId(deviceId, userId);

  return {
    status: ResultStatus.Success,
    data: null,
    extensions: [],
  };
},

}