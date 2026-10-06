import { Request, Response } from "express";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/request_types";
import { BlogServices } from "../../application/blogs.servise";
import { PostQueryInput } from "../../../posts/routes/input/post-query.input";
import { PostServices } from "../../../posts/application/post.servise";
import { mapToPostViewModel } from "../../../posts/routes/mappers/map-to post-view-model.util";
import { buildPostPagination } from "../../../posts/routes/output/post-list-paginated.uotput";

export async function getPostByBlogId(req: RequestWithParams<{id:string}>, res: Response){
    try{
        const blogId = req.params.id;
        const foundBlog = await BlogServices.getBlogByIdService(blogId)
             if (!foundBlog){
                res.sendStatus(HttpStatus.NotFound)
                
              
                return
              }

        const queryInput = req.query as unknown as PostQueryInput;      
        const { items, totalCount } = await PostServices.findMany(queryInput, blogId);      
        
        const mapperdPosts = items.map(post=>mapToPostViewModel(post))
        const response = buildPostPagination(
            mapperdPosts,
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