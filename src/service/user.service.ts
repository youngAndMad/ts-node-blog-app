import { sendGreeting, sendOtp } from "./mail.service";
import prisma from "../config/prisma.config";
import { RegistrationDto } from "../model/dto/registration.dto";
import { User } from "@prisma/client";
import { ConfirmEmailDto } from "../model/dto/confirm-email.dto";
import { ENV } from "../config/env.config";
import { TokenDto } from "../model/dto/token.dto";
import {
  generateToken,
  getExpirationByType,
  verifyToken,
} from "../provider/jwt";
import { TokenType } from "../model/enum/token-type";
import { hashPassword, comparePassword } from "../provider/encrypt";
import { LoginDto } from "../model/dto/login.dto";
import { UserDto } from "../model/dto/user.dto";

export async function register(
  registrationDto: RegistrationDto
): Promise<UserDto> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: registrationDto.email },
    });

    if (user !== null) {
      throw new Error(`email ${registrationDto.email} registered yet`);
    }

    const otp = generateOtp();
    const otpSentTime = sendOtp(otp, registrationDto.email);

    const registeredUser = await prisma.user.create({
      data: {
        email: registrationDto.email,
        password: await hashPassword(registrationDto.password),
        username: registrationDto.username,
        emailVerified: false,
        otp: otp,
        otpSentTime: otpSentTime,
      },
    });

    return {
      email: registeredUser.email,
      id: registeredUser.id,
      username: registeredUser.username,
    };
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

  return generateTokens(user);
}

export async function login(credentials: LoginDto): Promise<TokenDto> {
  const user = await prisma.user.findFirst({
    where: { email: credentials.email },
  });

  if (user === null) {
    throw new Error(`email ${credentials.email} not found`);
  }

  if (true !== user.emailVerified) {
    throw new Error(`email not verified`);
  }

  if (!(await comparePassword(credentials.password, user.password))) {
    throw new Error(`Invalid credentials`);
  }

  return generateTokens(user);
}

export async function refreshToken(refreshToken: string): Promise<TokenDto> {
  try {
    const decoded: any = await verifyToken(refreshToken, TokenType.REFRESH);
    const email = decoded.user.email; // Assuming user object is present in decoded
    const user = await prisma.user.findFirst({ where: { email: email } });

    if (user === null) {
      throw new Error("invalid credentials");
    }

    return generateTokens(user);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getAllUsers(): Promise<UserDto[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
}

export async function editUsername(
  id: number,
  username: string
): Promise<UserDto> {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (user === null) {
    throw new Error(`user by id ${id} not found`);
  }

  return prisma.user.update({
    where: { id: id },
    data: { username: username },
    select: { id: true, username: true, email: true },
  });
}

export async function deleteUser(id: number) {
  prisma.user.delete({ where: { id: id } });
}

const generateOtp = (): number => {
  const min = 100000;
  const max = 999999;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp;
};

const generateTokens = (user: User): TokenDto => {
  return {
    accessToken: generateToken(TokenType.ACCESS, user.email),
    accessTokenExpiration: getExpirationByType(TokenType.ACCESS),
    refreshToken: generateToken(TokenType.REFRESH, user.email),
    refreshTokenExpiration: getExpirationByType(TokenType.REFRESH),
  };
};
