import { sendGreeting, sendOtp } from "./mail.service";
import prisma from "../config/prisma.config";
import { RegistrationDto } from "../model/dto/registration.dto";
import { User } from "@prisma/client";
import { ConfirmEmailDto } from "../model/dto/confirm-email.dto";
import { ENV } from "../config/env.config";
import { TokenDto } from "../model/dto/token.dto";
import { generateToken, getExpirationByType } from "../provider/jwt";
import { TokenType } from "../model/enum/token-type";

export async function register(
  registrationDto: RegistrationDto
): Promise<User> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: registrationDto.email },
    });

    if (user !== null) {
      throw new Error(`email ${registrationDto.email} registered yet`);
    }

    const otp = generateOtp();
    const otpSentTime = sendOtp(otp, registrationDto.email);

    const createdUser = await prisma.user.create({
      data: {
        email: registrationDto.email,
        password: registrationDto.password, // todo: encrypt
        username: registrationDto.username,
        emailVerified: false,
        otp: otp,
        otpSentTime: otpSentTime,
      },
    });

    return createdUser;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function confirmEmail(
  emailConfirmDto: ConfirmEmailDto
): Promise<TokenDto> {
  const user = await prisma.user.findFirst({
    where: { email: emailConfirmDto.email },
  });

  if (user === null) {
    throw new Error(`email ${emailConfirmDto.email} not found`);
  }

  if (user.otp !== emailConfirmDto.otp) {
    throw new Error(`invalid otp`);
  }

  const otpExpirationTime = ENV.OTP_EXPIRATION_SECONDS * 1000;
  const currentTime = new Date().getTime();
  const otpSentTime = new Date(user.otpSentTime).getTime();

  if (currentTime - otpSentTime > otpExpirationTime) {
    throw new Error("OTP has expired");
  }

  await prisma.user.update({
    where: { email: user.email },
    data: { emailVerified: true },
  });

  sendGreeting(user.email);

  return {
    accessToken: generateToken(TokenType.ACCESS, user.email),
    accessTokenExpiration: getExpirationByType(TokenType.ACCESS),
    refreshToken: generateToken(TokenType.REFRESH, user.email),
    refreshTokenExpiration: getExpirationByType(TokenType.REFRESH),
  };
}

const generateOtp = (): number => {
  const min = 100000;
  const max = 999999;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp;
};
