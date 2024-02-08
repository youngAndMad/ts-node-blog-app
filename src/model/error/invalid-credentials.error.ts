import BaseError from "./base-error";

class InvalidCredentialsError extends BaseError {
  statusCode = 401; // Unauthorized
  message: string;

  constructor(message: string = `invalid credentials`) {
    super();
    this.message = message;
  }
}

export default InvalidCredentialsError;
