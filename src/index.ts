import express, { Express, Request, Response } from "express";
import { ENV } from "./config/env.config";
import prisma from "./config/prisma.config";

const app: Express = express();
const port = ENV.PORT;

async function main() {
  app.get("/", (req: Request, res: Response) => {
    res.send("Express +dewfr  Server");
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
