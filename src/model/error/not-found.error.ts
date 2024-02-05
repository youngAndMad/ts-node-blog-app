import BaseError from "./base-error";

class NotFoundError extends BaseError {
  statusCode = 404; // Not found
  message: string;

  constructor(entityClass: new () => any, entityId: string | number) {
    super();
    const className = entityClass.name || "UnknownClass";
    this.message = `${className} with id ${entityId} not found`;
  }
}

export default NotFoundError;
