import { userRepository } from "../../users/repository/user.repository"
import { bcryptService } from "../adapters/bcrypt.service";


export const AuthServices = {
    async checkCreentials(loginOrEmail:string, password:string){
       const user = await userRepository.findByLoginOrEmail(loginOrEmail, loginOrEmail)
        if (!user) return false;
        const isPasswordCorrect = await bcryptService.checkPassword(password, user.passwordHash)
    
    return isPasswordCorrect;
}

}