import { NextFunction, Response, json, Request } from "express";
import { getLogger } from "./provider/logger";
import cors from "cors";
import { ENV } from "./config/env.config";
import prisma from "./config/prisma.config";
import fileUpload from "express-fileupload";
import userRouter from "./router/user.router";
import requestLoggerMiddleware from "./middleware/logging.middleware";
import { app, server } from "./provider/socket";
import chatRouter from "./router/chat.router";
import fileRouter from "./router/file.router";
import messageRouter from "./router/message.router";
import { checkBuckets } from "./service/file.service";
import redisClient from "./config/redis.config";
import bodyParser from "body-parser";
import BaseError from "./model/error/base-error";

const log = getLogger("backend");

app.use(json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({ debug: true }));
app.use(cors());
app.use(requestLoggerMiddleware);

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/chat/", chatRouter);
app.use("/api/v1/file/", fileRouter);
app.use("/api/v1/message/", messageRouter);
const port = ENV.PORT;

app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
  log.error(`handled error by global exception handler ${err} `);
  return res.status(err.statusCode).json({ err });
});

async function main() {
  server.listen(port);
}

main()
  .then(async () => {
    log.info("successfully connected to object storage minio");
    await checkBuckets();
  })
  .then(async () => {
    await redisClient.connect();
    log.info("successfully connected to redis");
  })
  .then(async () => {
    await prisma.$connect();
    log.info("successfully connected to postgresql");
  })
  .then(() => {
    log.info(`[server]: Server is running at :${port}`);
  })
  .catch(async (e) => {
    log.error(e);
  });
