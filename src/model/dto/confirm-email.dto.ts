import { body, ValidationChain } from "express-validator";

export type ConfirmEmailDto = {
  email: string;
  otp: number;
};

export const emailConfirmationValidationRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("otp").isNumeric(),
];
