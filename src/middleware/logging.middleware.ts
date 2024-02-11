import { Request, Response, NextFunction } from "express";
import { getLogger } from "../provider/logger";

const log = getLogger("logging.middleware");

const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now(); // Capture the start time

  next();

  const endTime = Date.now();
  const executionTime = endTime - startTime;

  log.info(
    `Completed api request ${req.method} ${req.url} execution ${executionTime}ms`,
    {
      requestBody: req.body,
    }
  );
};

export default requestLoggerMiddleware;
