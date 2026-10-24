import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { UserQueryInput } from "../input/user-query.input";
import { buildUserPagination } from "../output/user-list-paginated-output";
import { userQueryRepository } from "../../repository/users.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { RequestWithQuery } from "../../../core/types/request_types";

export async function getUserListHandler(req: RequestWithQuery<UserQueryInput>, res: Response) {
    try {
        const queryInput = req.query
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
      errorsHandler(e, res);
}

}