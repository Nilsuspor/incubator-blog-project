import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParamsAndBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { mapPostInputDtoToPost } from "../mappers/map-post-input-dto-to-post.util";
import { blogsRepository } from "../../../blogs/repository/blog.repository";

export async function updatePostHandler(req: RequestWithParamsAndBody<{id:string},PostInputDto>, res: Response){
  try {  
    
  const id = req.params.id
    const foundPost = await postRepository.getPostById(id)
    if (!foundPost){
       res.status(HttpStatus.NotFound).send(createErrorMessages([{message:'Post not found',field:'id'}])
       )
    return
      }

      const foundBlog = await blogsRepository.getBlogById(req.body.blogId);
    if (!foundBlog) {
      res.sendStatus(HttpStatus.InternalServerError);
      return;
    }

    const updateData = {
      ...mapPostInputDtoToPost(req.body),
      blogName: foundBlog.name,
    };

    await postRepository.updatePost(id, updateData);  
    res.sendStatus(HttpStatus.NoContent);
    }catch{
        res.sendStatus(HttpStatus.InternalServerError)
  }
}