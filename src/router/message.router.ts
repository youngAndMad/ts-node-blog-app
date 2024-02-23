import express, { Request, Response } from "express";
import {
  deleteMessage,
  saveMessage,
  updateMessage,
} from "../service/message.service";
import { io } from "../provider/socket";
import { getChatMembers } from "../service/chat.service";
import { getUserSocket } from "../service/user-socket.service";
import { validate } from "../provider/validator";
import { messageValidationRules } from "../model/dto/message.dto";
const messageRouter = express.Router();

messageRouter.post("/", async (req: Request, res: Response) => {
  await validate(
    req,
    res,
    async () => {
      const { userId, chatId, content } = req.body;

      const savedMessage = await saveMessage({ userId, chatId, content });

      (await getChatMembers(savedMessage.chatId)).forEach(async (user) => {
        const socket = await getUserSocket(user.id);
        io.to(socket!).emit("newMessage", savedMessage);
      });

      res.status(201);
    },
    messageValidationRules
  );
});

messageRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = +req.query.id!;
  await deleteMessage(id);
  res.status(204);
});

messageRouter.put(":/id", async (req: Request, res: Response) => {
  const { content } = req.body;
  await updateMessage(+req.query.id!, content);
  res.status(200);
});

export default messageRouter;
