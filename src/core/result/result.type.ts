import { ResultStatus } from "./resultCode";
import { ValidationErrorType } from "../types/validation-error";


export type Result<T = null> = {
  status: ResultStatus;
  errorMessage?: string;
  extensions: ValidationErrorType[];
  data: T;
};