import { TokenType } from "./../model/enum/token-type";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.config";

export function generateToken(
  type: TokenType,
  subject: string,
  ...claims: Record<string, any>[]
): string {
  const token = jwt.sign(
    { type, ...Object.assign({}, ...claims) },
    getSecretByType(type),
    {
      expiresIn: getExpirationByType(type),
      subject: subject,
    }
  );
  return token;
}

export function verifyToken(token: string, type: TokenType): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getSecretByType(type), (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

const getSecretByType = (type: TokenType): string =>
  type === TokenType.ACCESS ? ENV.JWT_SECRET : ENV.JWT_PRIVATE_SECRET;

export const getExpirationByType = (type: TokenType): string =>
  type === TokenType.ACCESS
    ? ENV.ACCESS_TOKEN_EXPIRATION
    : ENV.REFRESH_TOKEN_EXPIRATION;
