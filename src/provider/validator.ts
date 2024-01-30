import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";

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

  res.status(400).json({ errors: errors.array() });
}
