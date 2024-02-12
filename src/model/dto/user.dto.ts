export type UserDto = {
  id: number;
  email: string;
  username: string;
  emailVerified: boolean;
  role: "ADMIN" | "USER" | "GUEST";
};
