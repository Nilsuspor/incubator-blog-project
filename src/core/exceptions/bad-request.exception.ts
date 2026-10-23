import {  ValidationErrorType } from "../types/validation-error";

export class BadRequestException extends Error {
    public errors: ValidationErrorType[]

    constructor(errors: ValidationErrorType[]) {
    super('Bad Request'); 
    this.errors = errors; 
  }
}