import BaseError from "./base-error";

export type EntityClass = "user" | "chat" | "message" | "user-profile-image";
class NotFoundError extends BaseError {
  statusCode = 404; // Not found
  message: string;

  constructor(entityClass: EntityClass, entityId: any) {
    super();
    this.message = `${entityClass} with id ${entityId} not found`;
  }
}

export default NotFoundError;
