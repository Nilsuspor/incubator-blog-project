import { Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { RequestWithParams } from "../../../core/types/request_types";
import { PostServices } from "../../application/post.servise";
import { errorsHandler } from "../../../core/exceptions/errors-handler";

export async function deletePostHandler(
  req: RequestWithParams<{ id: string }>,
  res: Response,
) {
  try {
    await PostServices.deletePostService(req.params.id);
    res.sendStatus(HttpStatus.NoContent); 
  } catch (e: unknown) {
              errorsHandler(e, res);
  }
}