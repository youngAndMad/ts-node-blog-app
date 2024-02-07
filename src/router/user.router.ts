import express, { Request, Response } from "express";
import {
  register,
  confirmEmail,
  login,
  refreshToken,
  getAllUsers,
  editUsername,
  deleteUser,
} from "../service/user.service";
import { registrationValidationRules } from "../model/dto/registration.dto";
import { emailConfirmationValidationRules } from "../model/dto/confirm-email.dto";
import { validate } from "../provider/validator";
import { loginValidationRules } from "../model/dto/login.dto";

let userRouter = express.Router();

userRouter.post(
  "/register",
  registrationValidationRules,
  async (req: Request, res: Response) => {
    await validate(
      req,
      res,
      async () => {
        const { email, username, password } = req.body;
        const response = await register({ email, username, password });
        res.status(201).json(response);
      },
      registrationValidationRules
    );
  }
);

userRouter.post(
  "/confirm-email",
  emailConfirmationValidationRules,
  async (req: Request, res: Response) => {
    await validate(
      req,
      res,
      async () => {
        const { otp, email } = req.body;
        const tokenDto = await confirmEmail({ otp, email });
        res.status(200).json(tokenDto);
      },
      emailConfirmationValidationRules
    );
  }
);

userRouter.post(
  "/login",
  loginValidationRules,
  async (req: Request, res: Response) => {
    await validate(
      req,
      res,
      async () => {
        const { email, password } = req.body;
        const tokenDto = await login({ email, password });
        res.status(200).json(tokenDto);
      },
      loginValidationRules
    );
  }
);

userRouter.post("/refresh-token", async (req: Request, res: Response) => {
  const refreshTokenFromHeader = req.header("refresh-token");

  if (refreshTokenFromHeader === undefined) {
    res.status(400).json({ error: "refresh token not provided" });
  }
  res.json(await refreshToken(refreshTokenFromHeader!));
});

userRouter.get("/admin/all", async (req: Request, res: Response) => {
  res.json(await getAllUsers());
});

userRouter.patch("/:id", async (req: Request, res: Response) => {
  const id = +req.params.id;
  const username = req.query.username as string;
  res.json(await editUsername(id, username));
});

userRouter.delete("/:id", async (req: Request, res: Response) => {
  await deleteUser(+req.params.id);
  res.status(204);
});

export default userRouter;
