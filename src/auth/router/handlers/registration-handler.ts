import {  Response } from "express"
import { RequestWithBody } from "../../../core/types/request_types"
import { RegistrationDto } from "../../dto/registration.dto";
import { AuthServices } from "../../application/auth.service";
import { ResultStatus } from "../../../core/result/resultCode";
import { HttpStatus } from "../../../core/types/http-statuses";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export const registrationHandler = async(req: RequestWithBody<RegistrationDto>, res: Response)=>{
    try {
       const { login, email, password } = req.body;
        
       const result = await AuthServices.registerUser(login, password, email)

       if (result.status === ResultStatus.BadRequest){
        res.status(HttpStatus.BadRequest).send({errorsMessages:result.extensions})
       }
       res.sendStatus(HttpStatus.NoContent);
    }catch (e: unknown) {
        errorsHandler(e, res); 
    }

}