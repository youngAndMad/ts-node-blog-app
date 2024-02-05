import { NextFunction, Response, json, Request } from "express";
import logger from "./provider/logger";
import cors from "cors";
import { ENV } from "./config/env.config";
import prisma from "./config/prisma.config";
import fileUpload from "express-fileupload";
import userRouter from "./router/user.router";
import requestLoggerMiddleware from "./middleware/logging.middleware";
import { app, server } from "./provider/socket";
import BaseError from "./model/error/base-error";

app.use(json());
app.use(fileUpload());
app.use(cors());
app.use(requestLoggerMiddleware);
app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.statusCode).json(err);
});

const port = ENV.PORT;

async function main() {
  console.table(ENV);

  app.use(userRouter);

  server.listen(port, () => {
    logger.info(`[server]: Server is running at :${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
