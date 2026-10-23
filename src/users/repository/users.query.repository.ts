import { ObjectId, Filter } from "mongodb";
import { UserQueryInput } from "../router/input/user-query.input";
import { User } from "../types/user";
import { userCollection } from "../../db/collections";
import { mapToUserViewModel } from "./mappers/map-to-user-view-model-unit";
import { UserViewModel } from "../dto/user.view.model";
import { NotFoundException } from "../../core/exceptions/not-found.exception";


export const userQueryRepository = {

    async findMany(queryDto:UserQueryInput

    ):Promise<{mappedUsers:UserViewModel[]; totalCount: number}>{
        const {
            pageNumber,
      pageSize,
      sortBy,
      sortDirection,
      searchLoginTerm,
      searchEmailTerm
        } = queryDto
       const skip = (pageNumber - 1) * pageSize;
        const filter: Filter<User> = {};
        const orConditions = []; 


        if (searchLoginTerm) {
            orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }

        if (searchEmailTerm) {
             orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
            }

        if (orConditions.length > 0) {
        filter.$or = orConditions;
}
     const [items, totalCount] = await Promise.all([
                 userCollection.find(filter)
                 .sort({[sortBy]: sortDirection})
                 .skip(skip).limit(pageSize)
                 .toArray(), 
                 userCollection.countDocuments(filter)
             ] );
     const mappedUsers = items.map(user =>mapToUserViewModel(user))
    return {mappedUsers, totalCount}
    },


    async findById(id:string):Promise<UserViewModel|null>{
        if (!ObjectId.isValid(id)) {
            return null; 
        }
        const foundUser = await userCollection.findOne({ _id: new ObjectId(id) })
        if (!foundUser){
            return null
        }
        const mappedUser = mapToUserViewModel(foundUser)
        return mappedUser
    },

    async findByIdOrFail(id:string):Promise<UserViewModel>{
        const foundUser = await this.findById(id)

        if(!foundUser){
            throw new NotFoundException('User not found')
        }
        return foundUser
    }    
    
}    