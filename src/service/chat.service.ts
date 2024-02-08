import InvalidPayloadError from "../model/error/invalid-payload.error";
import prisma from "../config/prisma.config";
import { findUser } from "./user.service";
import NotFoundError from "../model/error/not-found.error";

const createPrivateChat = async (
  senderId: number,
  receiverId: number
): Promise<number> => {
  const sender = await findUser(senderId)!;
  const receiver = await findUser(receiverId)!;

  if (sender === null || receiver === null) {
    throw new InvalidPayloadError("error: sender or receiver is null");
  }

  const chat = await prisma.chat.create({
    data: {
      members: {
        connect: [{ id: sender.id }, { id: receiver.id }],
      },
      createdTime: new Date(),
      messages: { create: [] },
      type: "PRIVATE",
    },
  });

  return chat.id;
};

const deletePrivateChat = async (id: number) => {
  const chat = await prisma.chat.findFirst({ where: { id: id } });

  if (chat === null) {
    throw new NotFoundError("chat", id);
  }

  await prisma.chat.delete({ where: { id: id } });
};

export { deletePrivateChat, createPrivateChat };
