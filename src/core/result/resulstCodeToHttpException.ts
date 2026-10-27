import { ResultStatus } from "./resultCode";
import { HttpStatus } from "../types/http-statuses";

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.Unauthorized:
      return HttpStatus.Unauthorized
    case ResultStatus.BadRequest:
      return HttpStatus.BadRequest;
    case ResultStatus.Forbidden:
      return HttpStatus.Forbidden;
    default:
      return HttpStatus.InternalServerError;
  }
};