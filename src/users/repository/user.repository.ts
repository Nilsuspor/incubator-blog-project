import { ObjectId, WithId} from "mongodb";
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

    async findByLoginOrEmail(login:string, email:string,):Promise<WithId<User>|null>{
        const foundUser = await userCollection.findOne({
      $or: [{ email: email }, { login: login }],
    })
        return foundUser
    },

    async findById(id:string):Promise<WithId<User>|null>{
        const foundUser = await userCollection.findOne({_id: new ObjectId(id)})
        
        return foundUser
    },

    async findByConfirmationCode(code:string):Promise<WithId<User>|null>{
        const foundUser = await userCollection.findOne({
            'emailConfirmation.confirmationCode': code
        })
        return foundUser
    },

    async activateUser(id:string):Promise<boolean>{
        const updateResult = await userCollection.updateOne({_id: new ObjectId(id)},{ $set:{ 'emailConfirmation.isConfirmed': true}})
        
        return updateResult.modifiedCount>0
    },

       async refreshCode(email:string, code: string, expDate: Date):Promise<boolean>{
        const refreshCodeResult = await userCollection.updateOne({email:email},{$set:{'emailConfirmation.confirmationCode': code, 
            'emailConfirmation.expirationDate':expDate}})
    
      return refreshCodeResult.modifiedCount>0
    }

    
}