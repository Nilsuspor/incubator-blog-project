import { Result } from "../../core/result/result.type";
import { userRepository } from "../../users/repository/user.repository"
import { bcryptService } from "../adapters/bcrypt.service";
import { ResultStatus } from "../../core/result/resultCode";
import { jwtServiсe } from "../adapters/jwt.service";
import { User } from "../../users/types/user";
import { WithId } from "mongodb";

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
}

}