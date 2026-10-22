import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { UserQueryInput } from "../input/user-query.input";
import { UserServices } from "../../application/user.service";
import { mapToUserViewModel } from "../../repository/mappers/map-to-user-view-model-unit";
import { buildUserPagination } from "../output/user-list-paginated-output";
import { userQueryRepository } from "../../repository/users.query.repository";


export async function getUserListHandler(req: Request, res: Response) {
    try {
        const queryInput = req.query as unknown as UserQueryInput
        const {mappedUsers, totalCount} = await userQueryRepository.findMany(queryInput)

        const response = buildUserPagination(
            mappedUsers,
            totalCount,
            queryInput.pageNumber,
            queryInput.pageSize
        )
        
    res.status(HttpStatus.Ok).send(response)
}
catch (e: unknown) { 
   console.log('🚨 ОШИБКА В ХЕНДЛЕРЕ БЛОГОВ:', e); 
   res.sendStatus(HttpStatus.InternalServerError);
}

}