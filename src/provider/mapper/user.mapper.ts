import { User } from "@prisma/client";
import { UserDto } from "../../model/dto/user.dto";

const mapUserToDto = (user: User): UserDto => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    emailVerified: user.emailVerified,
    role: user.role,
  };
};

export { mapUserToDto };
