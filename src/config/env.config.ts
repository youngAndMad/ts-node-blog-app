import { Environment } from "./../model/env";
import dotenv from "dotenv";
dotenv.config();

export const ENV: Environment = {
  DB_URL: process.env.DB_URL!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD!,
  PORT: +process.env.PORT!,
  SMTP_USERNAME: process.env.SMTP_USERNAME!,
};
