import { TokenType } from "../model/enum/token-type";
import { verifyToken } from "../provider/jwt";
import { Request, Response, NextFunction } from "express";
import { getLogger } from "../provider/logger";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Update the type according to your user model
    }
  }
}

const log = getLogger("auth.niddleware");

export function authTokenMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("Authorization")!;

  if (!token) {
    log.error(`token validation failed. Token is not present`);
    res.status(401).json({ message: "Unauthorized" });
  }

  if (!token.startsWith("Bearer ")) {
    log.error(`token validation failed. Invalid token type`);
    res.status(401).json({ message: "Invalid token type" });
  }

  verifyToken(token.substring("Bearer ".length), TokenType.ACCESS)
    .then((val) => {
      log.info(`success token validation user [${val.sub}]`);
      req.user = val.id;
      next();
    })
    .catch((error) => {
      log.error(`token validation failed ${error.message}`);
      res.status(403).json({ error: error });
    });
}
