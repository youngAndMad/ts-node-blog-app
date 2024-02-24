import InvalidPayloadError from "../model/error/invalid-payload.error";
import prisma from "../config/prisma.config";
import { findUser } from "./user.service";
import NotFoundError from "../model/error/not-found.error";
import { User } from "@prisma/client";
import { UserDto } from "../model/dto/user.dto";
import { ChatResponseDto } from "../model/dto/chat-response.dto";
import { mapChatToDto } from "../provider/mapper/chat.mapper";

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

const getChatMembers = async (id: number): Promise<UserDto[]> => {
  const chat = await prisma.chat.findFirst({
    where: { id: id },
    select: {
      members: true,
    },
  });

  if (chat === null) {
    throw new NotFoundError("chat", id);
  }

  return chat.members.map((user: User) => {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: user.emailVerified,
      role: user.role,
    };
  });
};

const getChatById = async (id: number): Promise<ChatResponseDto> => {
  const chat = await prisma.chat.findUnique({
    where: {
      id: id,
    },
    include: {
      members: {
        select: {
          id: true,
          email: true,
          username: true,
          emailVerified: true,
          role: true,
        },
      },
      messages: true,
    },
  });

  if (!chat) {
    throw new NotFoundError("chat", id); // Chat with the given ID not found
  }

  return mapChatToDto(chat);
};

const getUserChats = async (id: number): Promise<ChatResponseDto[]> => {
  return (
    await prisma.chat.findMany({
      where: {
        members: {
          some: {
            id: id,
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            email: true,
            username: true,
            emailVerified: true,
            role: true,
          },
        },
        messages: {
          orderBy: {
            sentTime: "desc",
          },
        },
      },
    })
  ).map((chat) => mapChatToDto(chat));
};

export {
  deletePrivateChat,
  createPrivateChat,
  getChatMembers,
  getChatById,
  getUserChats,
};
