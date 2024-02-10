import { MessageResponseDto } from "./message-response.dto";
import { UserDto } from "./user.dto";

export type ChatResponseDto = {
  id:number,
  messages: MessageResponseDto[];
  members: UserDto[];
  createdTime:Date
};
