import { ENV } from "../config/env.config";
import transporter from "../config/mail.config";

const sendGreeting = async (email: string): Promise<void> => {
  transporter.sendMail({
    from: ENV.EMAIL_SENDER,
    to: email,
    subject: "Welcome to Danekerscode Node js app",
    html: `<b>Welcome to our Blog App!</b><br>
              <p>Dear ${email} </p>
              <p>Thank you for joining Danekerscode App. We're excited to have you on board!</p>
              <p>Feel free to explore and share your thoughts with the community.</p>
              <p>Best regards.</p>
              <p>The Danekerscode</p>`,
  });
};

const sendOtp = async (otp: number, email: string): Promise<Date> => {
  transporter.sendMail({
    from: ENV.EMAIL_SENDER,
    to: email,
    subject: "Welcome to Danekerscode Node js app",
    html: `<p>Dear ${email}, </p>
            <p>Otp for email verification : ${otp}</p>
            <p>The Danekerscode</p>`,
  });

  return new Date();
};

export { sendGreeting, sendOtp };
