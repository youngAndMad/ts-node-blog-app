import express, { Express, json } from "express";
import logger from "./provider/logger";
import cors from "cors";
import { ENV } from "./config/env.config";
import prisma from "./config/prisma.config";
import userRouter from "./router/user.router";
import requestLoggerMiddleware from "./middleware/logging.middleware";

const app: Express = express();
app.use(json());
app.use(cors());
app.use(requestLoggerMiddleware);
const port = ENV.PORT;

async function main() {
  console.table(ENV);

  app.use(userRouter);

  app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
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
