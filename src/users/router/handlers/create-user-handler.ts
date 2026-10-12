import { Request,Response } from "express";
import { UserServices } from "../../application/user.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { userRepository } from "../../repository/user.repository";
import { mapToUserViewModel } from "../../repository/mappers/map-to-user-view-model-unit";


export async function createUserHandler(req:Request, res: Response) {
try{
    const result = await UserServices.create(req.body);
    if (typeof result !== 'string' && 'errorsMessages' in result) {
            res.status(HttpStatus.BadRequest).send(result);
            return; 
        }
    const newUser = await userRepository.findById(result)
    if (!newUser) {
            res.sendStatus(HttpStatus.InternalServerError);
            return;
        }
    
    res.status(HttpStatus.Created).send( mapToUserViewModel(newUser))

    }catch (e: unknown) {
        console.log('🚨 ОШИБКА СОЗДАНИЯ ЮЗЕРА:', e);
        res.sendStatus(HttpStatus.InternalServerError);

    }
    
}