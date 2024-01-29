import express, { Express, Request, Response } from "express";
import { ENV } from "./config/env.config";
import prisma from "./config/prisma.config";
import transporter from "./config/mail.config";

const app: Express = express();
const port = ENV.PORT;

async function main() {
  console.table(ENV);
  app.get("/", (req: Request, res: Response) => {
    res.send("Express +dewfr  Server");
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  // transporter.sendMail({
  //   from: "kkraken2005@gmail.com",
  //   to: "kkraken2005@gmail.com",
  //   subject: "Welcome to Danekerscode Node js Blog app",
  //   html: `<b>Welcome to our Blog App!</b><br>
  //       <p>Dear 'kkraken2005@gmail.com',, </p>
  //       <p>Thank you for joining Danekerscode Blog App. We're excited to have you on board!</p>
  //       <p>Feel free to explore and share your thoughts with the community.</p>
  //       <p>Best regards,</p>
  //       <p>The Danekerscode</p>`,
  // });
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
