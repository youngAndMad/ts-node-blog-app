import { ValidationChain, body } from "express-validator";

export type LoginDto = {
  email: string;
  password: string;
};

export const loginValidationRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
