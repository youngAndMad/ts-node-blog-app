import { ChatResponseDto } from "../../model/dto/chat-response.dto";
import { MessageResponseDto } from "../../model/dto/message-response.dto";

const mapChatToDto = (chat: any): ChatResponseDto => {
  return {
    id: chat.id,
    createdTime: chat.createdTime,
    members: chat.members.map((member: any) => {
      return {
        id: member.id,
        email: member.email,
        username: member.username,
        emailVerified: member.emailVerified,
        role: member.role,
      };
    }),
    messages: chat.messages.map((message: any) => {
      return {
        id: message.id,
        content: message.content,
        senderId: message.userId,
        sentTime: message.sentTime,
      } as MessageResponseDto;
    }),
  };
};

export { mapChatToDto };
