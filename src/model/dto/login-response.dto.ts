import { TokenDto } from "./token.dto";
import { UserDto } from "./user.dto";

export type LoginResponse = {
  user: UserDto;
  tokens: TokenDto;
};
