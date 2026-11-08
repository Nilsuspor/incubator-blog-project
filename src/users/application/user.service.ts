import { UserInputDto } from "../dto/user.input.dto";
import { userRepository } from "../repository/user.repository";
import { User } from "../types/user";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import { BadRequestException } from "../../core/exceptions/bad-request.exception";
import { WithId } from "mongodb";
import { NotFoundException } from "../../core/exceptions/not-found.exception";



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
      const isDeleted =await userRepository.deleteById(id)
      if (!isDeleted) {
                 throw new NotFoundException('User not found');
             }
    },



    async findByid(id:string):Promise<WithId<User>|null>{
      const foundUser = await userRepository.findById(id)
      if (!foundUser){
            throw new NotFoundException('User not found')
        }
      return foundUser  
    },

    async findByEmail(email:string):Promise<WithId<User>|null>{
      const foundUser = await userRepository.findByLoginOrEmail(email, email)
      if (!foundUser){
            throw new NotFoundException('User not found')
        }
      return foundUser  
    },


    async findByConfirmationCode(code:string){
      const foundUser = await userRepository.findByConfirmationCode(code)
      if (!foundUser){
        throw new NotFoundException('User not found')
      }
      return foundUser
    },

    async activateUser(id:string):Promise<boolean>{
      const isActivated = await userRepository.activateUser(id)
      if (!isActivated){
        throw new NotFoundException('User not found')
      }
      return isActivated
    },

    async refreshCode(email:string, code: string, expDate: Date):Promise<boolean>{

      const isRefreshed = await userRepository.refreshCode(email, code, expDate)
      if (!isRefreshed){
        throw new NotFoundException('User not found')
      }
      return isRefreshed
    }
 


    
}