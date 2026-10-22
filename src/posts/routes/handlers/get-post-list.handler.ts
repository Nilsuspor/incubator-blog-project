import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostQueryInput } from "../input/post-query.input";
import { buildPostPagination } from "../output/post-list-paginated.uotput";
import { postQueryRepository } from "../../repository/post.query.repository";
export async function  getPostListHandler(req: Request, res: Response){
    try{
       const queryInput = req.query as unknown as PostQueryInput;
        const {mappedPosts, totalCount} = await postQueryRepository.findMany(queryInput)
        
        const response = buildPostPagination(
            mappedPosts,
            totalCount,
            queryInput.pageNumber,
            queryInput.pageSize
        )
        res.status(HttpStatus.Ok).send(response)
    } catch (e: unknown) { 
   console.log('🚨 ОШИБКА В ХЕНДЛЕРЕ Постов:', e); 
   res.sendStatus(HttpStatus.InternalServerError);
  
    }
}
