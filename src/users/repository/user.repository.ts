import { WithId } from "mongodb";
import { UserQueryInput } from "../router/input/user-query.input";
import { User } from "../types/user";
import { userCollection } from "../../db/collections";

export const userRepository = {

    async findMany(queryDto:UserQueryInput

    ):Promise<{items:WithId<User>[]; totalCount: number}>{
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
     if (searchLoginTerm|| searchEmailTerm){
      filter.$or = [
        { login: { $regex: searchLoginTerm ?? '', $options: 'i' } },
        { email: { $regex: searchEmailTerm ?? '', $options: 'i' } }
    ];
     } 
     const items = await userCollection
     .find(filter)
     .sort({[sortBy]:sortDirection})
     .skip(skip)
     .limit(pageSize)
     .toArray();
        
     const totalCount = await userCollection.countDocuments(filter)
     
    return {items, totalCount}
    }


}