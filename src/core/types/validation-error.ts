export type ValidationErrorType = {
  message: string;
  field: string;
};

export type ValidationErrorDto = { errorsMessages: ValidationErrorType[] };