import BaseError from "./base-error";

class NotFoundError extends BaseError {
  statusCode = 404; // Not found
  message: string;

  constructor(entityClass: string, entityId: any) {
    super();
    this.message = `${entityClass} with id ${entityId} not found`;
  }
}

export default NotFoundError;
