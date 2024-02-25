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
import asyncTryCatchMiddleware from "../middleware/handle-error.middleware";

const messageRouter = express.Router();

messageRouter.post(
  "/",
  asyncTryCatchMiddleware(async (req: Request, res: Response) => {
    await validate(
      req,
      res,
      async () => {
        const { userId, chatId, content } = req.body;
        const sentAt = new Date();
        const savedMessage = await saveMessage({
          userId,
          chatId,
          content,
          sentAt,
        });

        (await getChatMembers(savedMessage.chatId)).forEach(async (user) => {
          const socket = await getUserSocket(user.id);
          io.to(socket!).emit("newMessage", savedMessage);
        });

        res
          .status(201)
          .json({ senderId: savedMessage.userId, ...savedMessage })
          .end();
      },
      messageValidationRules
    );
  })
);

messageRouter.delete(
  "/:id",
  asyncTryCatchMiddleware(async (req: Request, res: Response) => {
    const id = +req.query.id!;
    await deleteMessage(id);
    res.status(204).end();
  })
);

messageRouter.put(
  "/:id",
  asyncTryCatchMiddleware(async (req: Request, res: Response) => {
    const { content } = req.body;
    await updateMessage(+req.params.id, content);
    res.status(200).end();
  })
);

export default messageRouter;
