import { userRepository } from "../repository/user.repository";
import { UserQueryInput } from "../router/input/user-query.input";
import { User } from "../types/user";
import { WithId } from "mongodb";

export const UserServices = {

    async findMany(queryDto:UserQueryInput
            ):Promise<{items:WithId<User>[]; totalCount: number}>{
                
                return userRepository.findMany(queryDto)
            }


}