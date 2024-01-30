export type Environment = {
  PORT: number;
  SMTP_HOST: string;
  SMTP_USERNAME: string;
  SMTP_SERVICE: string;
  SMTP_PORT: number;
  SMTP_PASS: string;
  DB_URL: string;
  EMAIL_SENDER: string;
  JWT_SECRET: string;
  JWT_PRIVATE_SECRET: string;
  ACCESS_TOKEN_EXPIRATION: string;
  REFRESH_TOKEN_EXPIRATION: string;
};
