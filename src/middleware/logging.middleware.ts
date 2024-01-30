import { Request, Response, NextFunction } from "express";
import logger from "../provider/logger";

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = new Date();
  logger.info(`[${start.toISOString()}] ${req.method} ${req.url}`, {
    requestHeaders: req.headers,
    requestBody: req.body,
  });

  next();
};

export default requestLoggerMiddleware;
