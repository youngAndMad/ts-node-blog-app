import BaseError from "./base-error";

class EmailRegisteredYetError extends BaseError {
  statusCode = 400; // BadRequest
  message: string;

  constructor(email: string) {
    super();
    this.message = `Email '${email}' registered yet`;
  }
}

export default EmailRegisteredYetError;
