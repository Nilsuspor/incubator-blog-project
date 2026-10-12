import { ObjectId, WithId } from "mongodb";
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
     
    return {items, totalCount}
    },

    async create(newUser: User):Promise<string>{
        const insertResult = await userCollection.insertOne(newUser)  
        return insertResult.insertedId.toString()
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

    async deleteById(id: string):Promise<boolean>{
      const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(id)})
        return deleteResult.deletedCount > 0;

    },
}