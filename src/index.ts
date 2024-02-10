import { NextFunction, Response, json, Request } from "express";
import log from "./provider/logger";
import cors from "cors";
import { ENV } from "./config/env.config";
import prisma from "./config/prisma.config";
import fileUpload from "express-fileupload";
import userRouter from "./router/user.router";
import requestLoggerMiddleware from "./middleware/logging.middleware";
import { app, server } from "./provider/socket";
import BaseError from "./model/error/base-error";
import chatRouter from "./router/chat.router";
import fileRouter from "./router/file.router";
import messageRouter from "./router/message.router";
import { checkBuckets } from "./service/file.service";
import redisClient from "./config/redis.config";

app.use(json());
app.use(fileUpload());
app.use(cors());
app.use(requestLoggerMiddleware);
app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
  log.error(`handled error ${err.message}`);
  return res.status(err.statusCode).json(err);
});
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/chat/", chatRouter);
app.use("/api/v1/file/", fileRouter);
app.use("/api/v1/message/", messageRouter);

const port = ENV.PORT;

async function main() {
  console.table(ENV);
  server.listen(port);
}

main()
  .then(async () => await checkBuckets())
  .then(async () => await redisClient.connect())
  .then(() => {
    log.info(`[server]: Server is running at :${port}`);
  })
  .catch(async (e) => {
    log.error(e);
    await prisma.$disconnect();
    await redisClient.disconnect();
  });
