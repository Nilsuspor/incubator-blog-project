import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostQueryInput } from "../input/post-query.input";
import { buildPostPagination } from "../output/post-list-paginated.uotput";
import { postQueryRepository } from "../../repository/post.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";
import { RequestWithQuery } from "../../../core/types/request_types";

export async function  getPostListHandler(req: RequestWithQuery<PostQueryInput>, res: Response){
    try{
       const queryInput = req.query;
        const {mappedPosts, totalCount} = await postQueryRepository.findMany(queryInput)
        
        const response = buildPostPagination(
            mappedPosts,
            totalCount,
            queryInput.pageNumber,
            queryInput.pageSize
        )
        res.status(HttpStatus.Ok).send(response)
    } catch (e: unknown) {
          errorsHandler(e, res);
  
    }
}
