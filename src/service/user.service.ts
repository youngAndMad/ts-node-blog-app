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
import EmailRegisteredYetError from "../model/error/email-registered-yet.error";
import InvalidCredentialsError from "model/error/invalid-credentials.error";

const register = async (registrationDto: RegistrationDto): Promise<UserDto> => {
  const user = await prisma.user.findUnique({
    where: { email: registrationDto.email },
  });

  if (user !== null) {
    throw new EmailRegisteredYetError(registrationDto.email);
  }

  const otp = generateOtp();
  const otpSentTime = await sendOtp(otp, registrationDto.email);

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
    emailVerified: false,
  };
};

const confirmEmail = async (
  emailConfirmDto: ConfirmEmailDto
): Promise<TokenDto> => {
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
};

const login = async (credentials: LoginDto): Promise<TokenDto> => {
  const user = await prisma.user.findFirst({
    where: { email: credentials.email },
  });

  if (user === null) {
    throw new InvalidCredentialsError();
  }

  if (true !== user.emailVerified) {
    throw new InvalidCredentialsError(`email not verified`);
  }

  if (!(await comparePassword(credentials.password, user.password))) {
    throw new InvalidCredentialsError();
  }

  return generateTokens(user);
};

const refreshToken = async (refreshToken: string): Promise<TokenDto> => {
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
};

const getAllUsers = async (): Promise<UserDto[]> => {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      emailVerified: true,
    },
  });
};

const editUsername = async (id: number, username: string): Promise<UserDto> => {
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
    select: { id: true, username: true, email: true, emailVerified: true },
  });
};

const deleteUser = async (id: number) => {
  prisma.user.delete({ where: { id: id } });
};

const findUser = async (id: number): Promise<User | null> => {
  return prisma.user.findFirst({ where: { id: id } });
};

const generateOtp = (): number => {
  const min = 100000;
  const max = 999999;

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp;
};

const generateTokens = (user: User): TokenDto => {
  return {
    accessToken: generateToken(TokenType.ACCESS, user.email, { id: user.id }),
    accessTokenExpiration: getExpirationByType(TokenType.ACCESS),
    refreshToken: generateToken(TokenType.REFRESH, user.email, { id: user.id }),
    refreshTokenExpiration: getExpirationByType(TokenType.REFRESH),
  };
};

export {
  refreshToken,
  register,
  login,
  confirmEmail,
  getAllUsers,
  deleteUser,
  findUser,
  editUsername,
};
