import express, { Request, Response } from "express";
import {
  createPrivateChat,
  deletePrivateChat,
  getChatById,
  getUserChats,
} from "../service/chat.service";
import { authTokenMiddleware } from "../middleware/auth.middleware";

const chatRouter = express.Router();

chatRouter.post("", async (req: Request, res: Response) => {
  const { senderId, receiverId } = req.body;
  const chatId = await createPrivateChat(senderId, receiverId);
  res.status(201).json({ id: chatId });
});

chatRouter.delete("/:id", async (req: Request, res: Response) => {
  await deletePrivateChat(+req.params.id);
  res.status(204); // no content
});

chatRouter.get("/:id", async (req: Request, res: Response) => {
  const chat = await getChatById(+req.params.id);
  res.json(chat);
});

chatRouter.get(
  "/",
  authTokenMiddleware,
  async (req: Request, res: Response) => {
    res.json(await getUserChats(req.user));
  }
);

export default chatRouter;
