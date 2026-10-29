import { Response } from "express";
import { userServices } from "../../application/user.service";
import { HttpStatus } from "../../../core/types/http-statuses";
import { userQueryRepository } from "../../repository/users.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { RequestWithBody } from "../../../core/types/request_types";
import { UserInputDto } from "../../dto/user.input.dto";
import { UserViewModel } from "../../dto/user.view.model";

export async function createUserHandler(req:RequestWithBody<UserInputDto>, res: Response<UserViewModel>) {
try{
    const result = await userServices.create(req.body);
    const userPostModel = await userQueryRepository.findByIdOrFail(result)
    res.status(HttpStatus.Created).send(userPostModel)

    }catch (e: unknown) {
        errorsHandler(e, res);
    }
}