import { sendGreeting, sendOtp } from "./mail.service";
import prisma from "../config/prisma.config";
import { RegistrationDto } from "../model/dto/registration.dto";
import { User } from "@prisma/client";

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

const generateOtp = (): number => {
  const min = 100000;
  const max = 999999;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp;
};
