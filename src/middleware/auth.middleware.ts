import { TokenType } from "../model/enum/token-type";
import { verifyToken } from "../provider/jwt";
import { Request, Response, NextFunction } from "express";
const insecureEnpointList: string[] = [
  "/api/v1/user/register",
  "/api/v1/user/login",
];

export function authTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (insecureEnpointList.includes(req.url)) {
    next();
  }
  const token = req.header("Authorization")!;

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  if (!token.startsWith("Bearer ")) {
    res.status(401).json({ message: "Invalid token type" });
  }

  verifyToken(token.substring("Bearer ".length), TokenType.ACCESS).then(
    (val) => {
      console.log(val);
    }
  );

  next();
}
