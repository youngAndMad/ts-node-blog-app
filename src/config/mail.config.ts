import { ENV } from "./env.config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  service: ENV.SMTP_SERVICE,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: ENV.SMTP_USERNAME,
    pass: ENV.SMTP_PASS,
  },
  secure: true,
});

export default transporter;
