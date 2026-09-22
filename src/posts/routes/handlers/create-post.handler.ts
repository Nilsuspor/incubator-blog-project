import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithBody } from "../../../core/types/request_types";
import { PostInputDto } from "../../dto/post.input.dto";
import { getPostViewModel } from "../../post.mapper";
import { PostViewModel } from "../../dto/post.view.model";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";
import { ValidationErrorDto } from "../../../core/types/validation-error";

export function createPostHandler(req: RequestWithBody<PostInputDto>, 
  res: Response<PostViewModel|ValidationErrorDto>){const newPost = postRepository.createPost(req.body);
    res.status(HttpStatus.Created).send(getPostViewModel(newPost));
    }
