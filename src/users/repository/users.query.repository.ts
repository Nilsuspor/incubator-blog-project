import { ObjectId, WithId } from "mongodb";
import { UserQueryInput } from "../router/input/user-query.input";
import { User } from "../types/user";
import { userCollection } from "../../db/collections";
import { mapToUserViewModel } from "./mappers/map-to-user-view-model-unit";
import { UserViewModel } from "../dto/user.view.model";


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
        const filter: any = {};
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
     const items = await userCollection
     .find(filter)
     .sort({[sortBy]:sortDirection})
     .skip(skip)
     .limit(pageSize)
     .toArray();
        
     const totalCount = await userCollection.countDocuments(filter)
     const mappedUsers = items.map(user =>mapToUserViewModel(user))
    return {mappedUsers, totalCount}
    },


    async findById(id:string):Promise<WithId<User>|null>{
        if (!ObjectId.isValid(id)) {
            return null; 
        }
        const foundUser = await userCollection.findOne({ _id: new ObjectId(id) })
        return foundUser
    },

    async findByLoginOrEmail(login:string, email:string,):Promise<WithId<User>|null>{
        const foundUser = await userCollection.findOne({
      $or: [{ email: email }, { login: login }],
    })
        return foundUser
    },
}    