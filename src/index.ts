import express, { Express, json } from "express";
import logger from "./provider/logger";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { ENV } from "./config/env.config";
import prisma from "./config/prisma.config";
import fileUpload from "express-fileupload";
import userRouter from "./router/user.router";
import requestLoggerMiddleware from "./middleware/logging.middleware";
import { app, server, io } from "./provider/socket";

const userSocketMap = new Map<string, any>(); // {userId: socketId}

app.use(json());
app.use(fileUpload());
app.use(cors());
app.use(requestLoggerMiddleware);
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
    await prisma.$disconnect();
    process.exit(1);
  });
