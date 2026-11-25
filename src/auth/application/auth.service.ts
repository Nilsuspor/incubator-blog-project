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
import { authRepository } from "../repository/auth.repository";
import { createUserEntity } from "../../users/types/user.factory";


export const AuthServices = {
    async loginUser(
        loginOrEmail:string,
        password:string
    ):Promise<Result<{accessToken:string, refreshToken:string}|null>>{
        const result = await AuthServices.checkUserCredentials(loginOrEmail, password);
        if (result.status !== ResultStatus.Success)
            return {
            status: ResultStatus.Unauthorized,
            errorMessage: 'Unauthorized',
            extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
            data: null,
      };
        
        const accessToken = await jwtService.createToken(result.data!._id.toString());
        const refreshToken = await jwtService.createRefreshToken(result.data!._id.toString())
       return {
      status: ResultStatus.Success,
      data: { accessToken, refreshToken },
      extensions: [],
    };

    },


  async refreshUserTokens(
  token: string
): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
  const revoked = await AuthServices.revokeRefreshToken(token);
  if (revoked.status !== ResultStatus.Success || !revoked.data) {
    return { ...revoked, data: null };
  }

  const user = await userRepository.findById(revoked.data.userId);
  if (!user) {
    return {
      status: ResultStatus.Unauthorized,
      errorMessage: 'Unauthorized',
      extensions: [{ field: 'refreshToken', message: 'User not found' }],
      data: null,
    };
  }

  const accessToken = await jwtService.createToken(revoked.data.userId);
  const refreshToken = await jwtService.createRefreshToken(revoked.data.userId);

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

  async logOut(token: string): Promise<Result<null>> {
  const revoked = await AuthServices.revokeRefreshToken(token);
  if (revoked.status !== ResultStatus.Success) {
    return { ...revoked, data: null };
  }

  return {
    status: ResultStatus.Success,
    data: null,
    extensions: [],
  };
},

  async revokeRefreshToken(token: string): Promise<Result<{ userId: string } | null>> {
  const payload = await jwtService.verifyRefreshToken(token);
  if (!payload) {
    return {
      status: ResultStatus.Unauthorized,
      errorMessage: 'Unauthorized',
      extensions: [{ field: 'refreshToken', message: 'Token is invalid or expired' }],
      data: null,
    };
  }

  const inBlackList = await authRepository.isTokenInBlackList(token);
  if (inBlackList) {
    return {
      status: ResultStatus.Unauthorized,
      errorMessage: 'Unauthorized',
      extensions: [{ field: 'refreshToken', message: 'Token is invalid or expired' }],
      data: null,
    };
  }

  const expiresAt = new Date(payload.exp * 1000);
  await authRepository.addToBlacklist(token, expiresAt);

  return {
    status: ResultStatus.Success,
    data: { userId: payload.userId },
    extensions: [],
  };
},
}