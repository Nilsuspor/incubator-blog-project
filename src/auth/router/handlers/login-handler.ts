import { Response } from "express";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resulstCodeToHttpException";
import { HttpStatus } from "../../../core/types/http-statuses"; 
import { AuthServices } from "../../application/auth.service";
import { RequestWithBody } from "../../../core/types/request_types";
import { LoginDto } from "../../dto/login.dto";
import { LoginSuccessViewModel } from "../../dto/login.success.view.,model";
import { ValidationErrorDto } from "../../../core/types/validation-error";

export const loginHandler = async (req: RequestWithBody<LoginDto>, 
    res: Response<LoginSuccessViewModel| ValidationErrorDto>) => {
    const { loginOrEmail, password } = req.body;

    
    const ip = req.ip || 'unknown';
    const title = req.headers['user-agent'] || 'Unknown device';    
    const result = await AuthServices.loginUser(
  req.body.loginOrEmail,
  req.body.password,
  ip,
  title
);
    
    

     if (result.status !== ResultStatus.Success|| !result.data) {
      return res.status(resultCodeToHttpException(result.status)).send({errorsMessages:result.extensions});
    }
    const { accessToken, refreshToken } = result.data;
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
    });

    return res.status(HttpStatus.Ok).send({ accessToken });
};