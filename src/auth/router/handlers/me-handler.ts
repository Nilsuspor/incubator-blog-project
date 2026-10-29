import { RequestWithUserId } from "../../../core/types/request_types"
import { IdType } from "../../../core/types/id"
import { HttpStatus } from "../../../core/types/http-statuses";
import { userQueryRepository } from "../../../users/repository/users.query.repository";
import { Response } from "express";
import { MeViewModel } from "../../dto/me.view.model";

export const meHandler = async(req: RequestWithUserId<IdType>, res: Response<MeViewModel>)=>{
    const userId = req.user?.id as string;
    if (!userId) return res.sendStatus(HttpStatus.Unauthorized);

    const me = await userQueryRepository.findById(userId);

    if (!me) return res.sendStatus(HttpStatus.Unauthorized) 

    const meViewModel = {
        email: me.email,
        login: me.login,
        userId: me.id 
    };  

    return res.status(HttpStatus.Ok).send(meViewModel);
  }
