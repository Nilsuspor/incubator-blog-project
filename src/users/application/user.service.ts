import { UserInputDto } from "../dto/user.input.dto";
import { userRepository } from "../repository/user.repository";
import { UserQueryInput } from "../router/input/user-query.input";
import { User } from "../types/user";
import { WithId } from "mongodb";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import { ValidationErrorDto } from "../../core/types/validation-error";
import { userQueryRepository } from "../repository/users.query.repository";

export const UserServices = {

    
    async create(dto: UserInputDto):Promise<string|ValidationErrorDto>{
        const existingUser = await userQueryRepository.findByLoginOrEmail(dto.login, dto.email);
        if (existingUser) {
      if (existingUser.email === dto.email) {
        return {
          errorsMessages: [{ message: 'email should be unique', field: 'email' }]
        };
      }
      if (existingUser.login === dto.login) {
        return {
          errorsMessages: [{ message: 'login should be unique', field: 'login' }]
        };
      }
    }
    


        const {login, password, email} = dto
         const passwordHash = await bcryptService.generateHash(password);

        const newUser: User = {
      login,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

        const newUserId = await userRepository.create(newUser);

        return newUserId
    },
    
    async delete(id:string):Promise<boolean>{
      const isDeleted = await userRepository.deleteById(id)
      return isDeleted
    }


}