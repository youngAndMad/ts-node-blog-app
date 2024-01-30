import { body, ValidationChain } from "express-validator";
export type RegistrationDto = {
  email: string;
  password: string;
  username: string;
};

export const registrationValidationRules: ValidationChain[] = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
