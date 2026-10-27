import { Response } from "express";
import { ResultStatus } from "../../../core/result/resultCode";
import { resultCodeToHttpException } from "../../../core/result/resulstCodeToHttpException";
import { HttpStatus } from "../../../core/types/http-statuses"; 
import { AuthServices } from "../../application/auth.service";
import { RequestWithBody } from "../../../core/types/request_types";
import { LoginDto } from "../../types/login.dto";

export const loginHandler = async (req: RequestWithBody<LoginDto>, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const result = await AuthServices.loginUser(loginOrEmail, password);


     if (result.status !== ResultStatus.Success) {
      return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
    }

    return res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });
};