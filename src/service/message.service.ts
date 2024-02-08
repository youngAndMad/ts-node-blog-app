import { MessageDto } from "model/dto/message.dto";
import prisma from "../config/prisma.config";

const saveMessage = async (messageDto: MessageDto) => {
  await prisma.message.create({
    data: {
      content: messageDto.content,
      chatId: messageDto.chatId,
      userId: messageDto.userId,
      sentTime: new Date(),
    },
  });

  return messageDto;
};

const deleteMessage = async (id: number) => {
  await prisma.message.delete({
    where: {
      id: id,
    },
  });
};

const updateMessage = async (id: number, content: string) => {};

export { saveMessage, updateMessage, deleteMessage };
