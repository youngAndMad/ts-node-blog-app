import { body, ValidationChain } from "express-validator";
export type MessageDto = {
  chatId: number;
  content: string;
  userId: number;
  sentAt: Date;
};

export const messageValidationRules: ValidationChain[] = [
  body("content").notEmpty(),
  body("userId").isNumeric(),
  body("chatId").isNumeric(),
];
