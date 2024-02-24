import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import DataValidationError from "../model/error/data-validation.error";

export async function validate(
  req: Request,
  res: Response,
  next: NextFunction,
  rules: ValidationChain[]
): Promise<void> {
  await Promise.all(rules.map((rule) => rule.run(req)));

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return next(new DataValidationError(errors));
}
