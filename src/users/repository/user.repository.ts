import { ObjectId, WithId} from "mongodb";
import { User } from "../types/user";
import { userCollection } from "../../db/collections";
import { NotFoundException } from "../../core/exceptions/not-found.exception";


export const userRepository = {

    async create(newUser: User):Promise<string>{
        const insertResult = await userCollection.insertOne(newUser)  
        return insertResult.insertedId.toString()
    },

   

    async deleteById(id: string):Promise<void>{
      const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(id)})
       if (deleteResult.deletedCount < 1) {
               throw new NotFoundException('User not found');
           }

    },

    async findByLoginOrEmail(login:string, email:string,):Promise<WithId<User>|null>{
        const foundUser = await userCollection.findOne({
      $or: [{ email: email }, { login: login }],
    })
        return foundUser
    },

    async findById(id:string):Promise<WithId<User>|null>{
        const foundUser = await userCollection.findOne({_id: new ObjectId(id)})
        if (!foundUser){
            throw new NotFoundException('User not found')
        }
        return foundUser
    }
}