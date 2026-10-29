import { UserInputDto } from "../dto/user.input.dto";
import { userRepository } from "../repository/user.repository";
import { User } from "../types/user";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import { BadRequestException } from "../../core/exceptions/bad-request.exception";
import { WithId } from "mongodb";

export const userServices = {

    
    async create(dto: UserInputDto):Promise<string>{
        const existingUser = await userRepository.findByLoginOrEmail(dto.login, dto.email);
        if (existingUser) {
      if (existingUser.email === dto.email) {
        
        throw new BadRequestException([{ message: 'email should be unique', field: 'email' }])
        
      }
      if (existingUser.login === dto.login) {
       throw new BadRequestException( [{ message: 'login should be unique', field: 'login' }])
        
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
    
    async delete(id:string):Promise<void>{
      await userRepository.deleteById(id)
      return 
    },

    async findByid(id:string):Promise<WithId<User>|null>{
      return await userRepository.findById(id)
    }
}