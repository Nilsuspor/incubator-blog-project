import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { PostServices } from "../../application/post.servise";
import { PostQueryInput } from "../input/post-query.input";
import { mapToPostViewModel } from "../mappers/map-to post-view-model.util";
import { buildPostPagination } from "../output/post-list-paginated.uotput";
export async function  getPostListHandler(req: Request, res: Response){
    try{
       const queryInput = req.query as unknown as PostQueryInput;
        const {items, totalCount} = await PostServices.findMany(queryInput)

        const mappedPosts = items.map(post => mapToPostViewModel(post))
        
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
