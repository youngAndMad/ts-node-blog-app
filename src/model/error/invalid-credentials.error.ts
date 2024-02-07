import BaseError from "./base-error";

class InvalidCredentialsError extends BaseError {
  statusCode = 401; // Unauthorized
  message: string;

  constructor() {
    super();
    this.message = `invalid credentials`;
  }
}

export default InvalidCredentialsError;
