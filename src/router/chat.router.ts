import express, { Request, Response } from "express";
import { createPrivateChat, deletePrivateChat } from "../service/chat.service";

const chatRouter = express.Router();

chatRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    await createPrivateChat(senderId, receiverId);
    res.status(201).json({ message: "Private chat created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

chatRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const chatId = parseInt(req.params.id, 10);
    await deletePrivateChat(chatId);
    res.json({
      message: `Private chat with ID ${chatId} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default chatRouter;
