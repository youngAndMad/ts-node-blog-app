import { Request, Response, NextFunction } from "express";
import logger from "../provider/logger";

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`http method exec ${req.method} ${req.url}`, {
    requestHeaders: req.headers,
    requestBody: req.body,
  });

  next();
};

export default requestLoggerMiddleware;
