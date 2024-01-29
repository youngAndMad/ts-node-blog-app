import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ENV } from "./config/env.config";

dotenv.config();

const app: Express = express();
const port = ENV.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express +dewfr  Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
