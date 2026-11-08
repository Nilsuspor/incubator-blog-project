import { Result } from "../../core/result/result.type";
import { userRepository } from "../../users/repository/user.repository"
import { bcryptService } from "../adapters/bcrypt.service";
import { ResultStatus } from "../../core/result/resultCode";
import { jwtServiсe } from "../adapters/jwt.service";
import { User } from "../../users/types/user";
import { WithId } from "mongodb";
import { randomUUID } from "node:crypto";
import { add } from "date-fns";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emailExamples";
import { RegistrationDto } from "../dto/registration.dto";
import { userServices } from "../../users/application/user.service";

export const AuthServices = {
    async loginUser(
        loginOrEmail:string,
        password:string
    ):Promise<Result<{accessToken:string}|null>>{
        const result = await this.checkUserCredentials(loginOrEmail, password);
        if (result.status !== ResultStatus.Success)
            return {
            status: ResultStatus.Unauthorized,
            errorMessage: 'Unauthorized',
            extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
            data: null,
      };
        
        const accessToken = await jwtServiсe.createToken(result.data!._id.toString());
       return {
      status: ResultStatus.Success,
      data: { accessToken },
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

async registerUser(dto: RegistrationDto){
  const { login, email, password } = dto;
  const user = await userRepository.findByLoginOrEmail(login, email)
  
  if (user) {
    if (user.email === email) {
        return {
            status: ResultStatus.BadRequest,
            data: null,
            errorMessage: 'Bad Request',
            extensions: [{ field: 'email', message: 'User with this email already exists' }],
        };
    }
    if (user.login === login) {
        return {
            status: ResultStatus.BadRequest,
            data: null,
            errorMessage: 'Bad Request',
            extensions: [{ field: 'login', message: 'User with this login already exists' }],
        };
    }
}
  const passwordHash = await bcryptService.generateHash(password)
  
  const newUser: User = {
    login,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
    emailConfirmation: {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), {
        hours :1,
        minutes:30,
      }),
      isConfirmed: false
  
    }
  }

  await userRepository.create(newUser)

  nodemailerService
  .sendEmail(
    newUser.email,
    newUser.emailConfirmation!.confirmationCode,
    emailExamples.registrationEmail,
  ).catch(er => console.error('error in send email:', er));
 return {
      status: ResultStatus.Success,
      data: newUser,
      extensions: [],
    };
},

async confirmUser(code:string){
  const user = await userServices.findByConfirmationCode(code)
  if (!user) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'code', message: 'Code is incorrect' }],
    };
  }
if (user.emailConfirmation!.isConfirmed) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'code', message: 'Email is already confirmed' }],
    };
  }
  if (user.emailConfirmation!.expirationDate < new Date()) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'code', message: 'Confirmation code is expired' }],
    };
  }

  await userServices.activateUser(user._id.toString())
  return {
    status: ResultStatus.Success,
    data: null,
    extensions: [],
  };
},

async emailResending(email:string){
  const user = await userServices.findByEmail(email)
  if (!user) {
    return {
      status: ResultStatus.BadRequest,
      data: null,
      extensions: [{ field: 'email', message: 'user not found' }],
    };
  }
  if (user.emailConfirmation!.isConfirmed === true){
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

  await userServices.refreshCode(email, newCode, newExpDate)

    nodemailerService
  .sendEmail(
    user.email,
    newCode,
    emailExamples.registrationEmail,
  ).catch(er => console.error('error in send email:', er));
 return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
      
}

}