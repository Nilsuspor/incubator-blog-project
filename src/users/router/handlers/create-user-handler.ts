import { Request,Response } from "express";
import { UserServices } from "../../application/user.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { userQueryRepository } from "../../repository/users.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function createUserHandler(req:Request, res: Response) {
try{
    const result = await UserServices.create(req.body);
    const newUser = await userQueryRepository.findByIdOrFail(result)
    res.status(HttpStatus.Created).send(newUser)

    }catch (e: unknown) {
        errorsHandler(e, res);
    }
}