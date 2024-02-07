import prisma from "../config/prisma.config";
import { findUser } from "./user.service";

export async function createPrivateChat(
  senderId: number,
  receiverId: number
): Promise<number> {
  const sender = await findUser(senderId)!;
  const receiver = await findUser(receiverId)!;

  if (sender === null || receiver === null) {
    throw new Error("error: sender or receiver is null");
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
}

export async function deletePrivateChat(id: number) {
  const chat = await prisma.chat.findFirst({ where: { id: id } });

  if (chat === null) {
    throw new Error(`chat with id ${id} not found`);
  }
}
