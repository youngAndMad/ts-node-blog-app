import express, { Request, Response } from "express";
import { register, confirmEmail, login } from "../service/user.service";
import { registrationValidationRules } from "../model/dto/registration.dto";
import { emailConfirmationValidationRules } from "../model/dto/confirm-email.dto";
import log from "../provider/logger";
import { validate } from "../provider/validator";
import { loginValidationRules } from "../model/dto/login.dto";

let userRouter = express.Router();

userRouter.post(
  "/api/v1/user/register",
  registrationValidationRules,
  async (req: Request, res: Response) => {
    await validate(
      req,
      res,
      async () => {
        const { email, username, password } = req.body;
        try {
          const user = await register({ email, username, password });
          res.status(201).json(user);
        } catch (err: any) {
          log.error(err.message);
          res.status(405).json({ error: err.message });
        }
      },
      registrationValidationRules
    );
  }
);

userRouter.post(
  "/api/v1/user/confirm-email",
  emailConfirmationValidationRules,
  async (req: Request, res: Response) => {
    await validate(
      req,
      res,
      async () => {
        const { otp, email } = req.body;
        try {
          const tokenDto = await confirmEmail({ otp, email });
          res.status(200).json(tokenDto);
        } catch (err: any) {
          log.error(err.message);
          res.status(405).json({ error: err.message });
        }
      },
      emailConfirmationValidationRules
    );
  }
);

userRouter.post(
  "/api/v1/user/login",
  loginValidationRules,
  async (req: Request, res: Response) => {
    await validate(
      req,
      res,
      async () => {
        const { email, password } = req.body;
        try {
          const tokenDto = await login({ email, password });
          res.status(200).json(tokenDto);
        } catch (err: any) {
          log.error(err.message);
          res.status(405).json({ error: err.message });
        }
      },
      loginValidationRules
    );
  }
);

export default userRouter;
