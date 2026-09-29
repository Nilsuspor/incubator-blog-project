import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { postRepository } from "../../repository/post.repository";
import { RequestWithParams } from "../../../core/types/request_types";
import { createErrorMessages } from "../../../core/middlewares/validation/input-validation-result.middleware";

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    const isDeleted = await postRepository.deletePost(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound); // 404, если поста нет
      return;
    }

    res.sendStatus(HttpStatus.NoContent); // 204, если успешно удалили
  } catch (error) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
}