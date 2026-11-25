import { UserInputDto } from "../dto/user.input.dto";
import { userRepository } from "../repository/user.repository";
import { User } from "../types/user";
import { bcryptService } from "../../auth/adapters/bcrypt.service";
import { BadRequestException } from "../../core/exceptions/bad-request.exception";
import { WithId } from "mongodb";
import { NotFoundException } from "../../core/exceptions/not-found.exception";
import { createUserEntity } from "../types/user.factory";


export const userServices = {

  async create(dto: UserInputDto): Promise<string> {
  const { login, password, email } = dto;
  const existingUser = await userRepository.findByLoginOrEmail(login, email);

  if (existingUser) {
    const field = existingUser.email === email ? 'email' : 'login';
    throw new BadRequestException([
      { message: `${field} should be unique`, field },
    ]);
  }

  const passwordHash = await bcryptService.generateHash(password);
  const newUser = createUserEntity({
    login,
    email,
    passwordHash,
    isConfirmed: true,
  });

  return userRepository.create(newUser);
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
      return foundUser  
    },


      async findByLoginOrEmail(login:string,email:string):Promise<WithId<User>|null>{
      const foundUser = await userRepository.findByLoginOrEmail(login, email)
      return foundUser  
    },


    async findByConfirmationCode(code:string){
      const foundUser = await userRepository.findByConfirmationCode(code)
      return foundUser
    },


    async activateUser(id:string):Promise<boolean>{
      const isActivated = await userRepository.activateUser(id)
      return isActivated
    },


    async refreshCode(email:string, code: string, expDate: Date):Promise<boolean>{
      const isRefreshed = await userRepository.refreshCode(email, code, expDate)
      return isRefreshed
    }
 


    
}