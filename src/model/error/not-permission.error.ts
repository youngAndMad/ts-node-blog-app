import BaseError from "./base-error";

class ForbiddenError extends BaseError {
  statusCode = 403; // Forbidden
  message: string;

  constructor() {
    super();
    this.message = `not enough permissions for this action`;
  }
}

export default ForbiddenError;
