import express, { Request, Response } from "express";
import { createPrivateChat, deletePrivateChat } from "../service/chat.service";

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

export default chatRouter;
