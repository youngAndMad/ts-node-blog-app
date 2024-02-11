import { Request, Response, NextFunction } from "express";
import { getLogger } from "../provider/logger";
import { verifyToken } from "../provider/jwt";
import { TokenType } from "../model/enum/token-type";

const log = getLogger("admin.middleware");

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
      if (val.role === "ADMIN") {
        log.info(`success token validation admin = ${val.sub}`);
        next();
      } else {
        log.warn(`user ${val.sub} have not access to endpoint ${req.url}`);
        res.status(403).json({ message: "Forbidden" });
      }
    })
    .catch((error) => {
      log.error(`token validation failed ${error.message}`);
      res.status(403).json({ error: error });
    });
};
