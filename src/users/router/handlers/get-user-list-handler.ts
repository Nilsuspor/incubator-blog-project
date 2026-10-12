import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { UserQueryInput } from "../input/user-query.input";
import { UserServices } from "../../application/user.service";
import { mapToUserViewModel } from "../../repository/mappers/map-to-user-view-model-unit";
import { buildUserPagination } from "../output/user-list-paginated-output";


export async function getUserListHandler(req: Request, res: Response) {
    try {
        const queryInput = req.query as unknown as UserQueryInput
        const {items, totalCount} = await UserServices.findMany(queryInput)
        const mappedUsers = items.map(user =>mapToUserViewModel(user))

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