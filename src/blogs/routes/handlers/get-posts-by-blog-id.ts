import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/request_types";
import { PostQueryInput } from "../../../posts/routes/input/post-query.input";
import { buildPostPagination } from "../../../posts/routes/output/post-list-paginated.uotput";
import { blogsQueryRepository } from "../../repository/blog.query.repository";
import { postQueryRepository } from "../../../posts/repository/post.query.repository";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function getPostByBlogId(req: RequestWithParams<{id:string}>, res: Response){
    try{
        const blogId = req.params.id;
        await blogsQueryRepository.findByIdOrFail(blogId)
        const queryInput = req.query as unknown as PostQueryInput;      
        const { mappedPosts, totalCount } = await postQueryRepository.findMany(queryInput, blogId);      
        
      
        const response = buildPostPagination(
            mappedPosts,
            totalCount,
            queryInput.pageNumber,
            queryInput.pageSize
        )
        res.status(HttpStatus.Ok).send(response)
    }catch (e: unknown) {
            errorsHandler(e, res);
  }
}