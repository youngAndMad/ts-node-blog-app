import { Request, Response, NextFunction } from "express";
import logger from "../provider/logger";

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now(); // Capture the start time

  next();

  const endTime = Date.now();
  const executionTime = endTime - startTime;

  logger.info(
    `HTTP method exec ${req.method} ${req.url} execution ${executionTime}ms`,
    {
      requestBody: req.body,
    }
  );
};

export default requestLoggerMiddleware;
