import { ObjectId, WithId } from "mongodb";
import { UserQueryInput } from "../router/input/user-query.input";
import { User } from "../types/user";
import { userCollection } from "../../db/collections";

export const userRepository = {

   

    async create(newUser: User):Promise<string>{
        const insertResult = await userCollection.insertOne(newUser)  
        return insertResult.insertedId.toString()
    },

   

    async deleteById(id: string):Promise<boolean>{
      const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(id)})
        return deleteResult.deletedCount > 0;

    },
}