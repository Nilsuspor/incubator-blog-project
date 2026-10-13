import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses"; 
import { AuthServices } from "../application/auth.service";

export const loginHandler = async (req: Request, res: Response) => {
    const { loginOrEmail, password } = req.body;

    const isValidUser = await AuthServices.checkCreentials(loginOrEmail, password);

    if (!isValidUser) {
        res.sendStatus(HttpStatus.Unauthorized); 
        return;
    }

    res.sendStatus(HttpStatus.NoContent); 
};