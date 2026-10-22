import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/request_types";
import { PostQueryInput } from "../../../posts/routes/input/post-query.input";
import { buildPostPagination } from "../../../posts/routes/output/post-list-paginated.uotput";
import { blogsQueryRepository } from "../../repository/blog.query.repository";
import { postQueryRepository } from "../../../posts/repository/post.query.repository";

export async function getPostByBlogId(req: RequestWithParams<{id:string}>, res: Response){
    try{
        const blogId = req.params.id;
        const foundBlog = await blogsQueryRepository.findById(blogId)
             if (!foundBlog){
                res.sendStatus(HttpStatus.NotFound)
                return
              }
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
    console.log('🚨 ОШИБКА В ХЕНДЛЕРЕ GET /blogs/:id/posts:', e);
    res.sendStatus(HttpStatus.InternalServerError);
  }
}