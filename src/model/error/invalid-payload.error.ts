import BaseError from "./base-error";

class InvalidPayloadError extends BaseError {
  statusCode = 400; // BadRequest
  message: string;

  constructor(email: string) {
    super();
    this.message = `Email '${email}' registered yet`;
  }
}

export default InvalidPayloadError;
