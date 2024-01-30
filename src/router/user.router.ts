import express, { Request, Response } from "express";
import { register } from "../service/user.service";

let userRouter = express.Router();

userRouter.post(
  "/api/v1/user/register",
  async (req: Request, res: Response) => {
    console.log("/api/v1/user/register");
    const { email, username, password } = req.body;

    await register({ email, username, password })
      .then((user) => res.status(201).json(user))
      .catch((err) => res.json({ err }));
  }
);

export default userRouter;
