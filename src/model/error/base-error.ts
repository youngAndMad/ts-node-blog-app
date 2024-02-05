abstract class BaseError extends Error {
  abstract statusCode: number;
  constructor(public message: string = "An error occurred") {
    super();
  }
}

export default BaseError;
