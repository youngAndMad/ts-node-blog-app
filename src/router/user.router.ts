import express, { Request, Response } from "express";
import { register, confirmEmail } from "../service/user.service";
import { registrationValidationRules } from "../model/dto/registration.dto";
import { emailConfirmationValidationRules } from "../model/dto/confirm-email.dto";
import logger from "../provider/logger";
import { validationResult } from "express-validator";
import { validate } from "../provider/validator";

let userRouter = express.Router();

userRouter.post(
  "/api/v1/user/register",
  registrationValidationRules,
  async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    await register({ email, username, password })
      .then((user) => res.status(201).json(user))
      .catch((err: any) => {
        logger.error(err.message);
        res.status(500).json({ err: err.message });
      });
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
          logger.error(err.message);
          res.status(500).json({ error: err.message });
        }
      },
      emailConfirmationValidationRules
    );
  }
);

export default userRouter;
