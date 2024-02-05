import { Result, ValidationError } from "express-validator";
import BaseError from "./base-error";
class DataValidationError extends BaseError {
  statusCode = 400; // bad request
  errors: ValidationError[];

  constructor(args: Result<ValidationError>) {
    super();
    this.errors = args.array();
  }
}

export default DataValidationError;
