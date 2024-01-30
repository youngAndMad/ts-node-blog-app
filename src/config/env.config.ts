import { Environment } from "./../model/env";
import dotenv from "dotenv";
dotenv.config();

export const ENV: Environment = {
  DB_URL: process.env.DB_URL!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PASS: process.env.SMTP_PASS!,
  EMAIL_SENDER: process.env.EMAIL_SENDER!,
  PORT: +process.env.PORT!,
  SMTP_USERNAME: process.env.SMTP_USERNAME!,
  SMTP_PORT: +process.env.SMTP_PORT!,
  SMTP_SERVICE: process.env.SMTP_SERVICE!,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_PRIVATE_SECRET: process.env.JWT_PRIVATE_SECRET!,
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION!,
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION!,
  OTP_EXPIRATION_SECONDS: +process.env.OTP_EXPIRATION_SECONDS!,
  REDIS_URL: process.env.REDIS_URL!,
};
