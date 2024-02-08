import redisClient from "../config/redis.config";

const USER_SOCKET_HASH_KEY = "user-socket";

const setUserSocket = async (userId: number, socketId: any) => {
  await redisClient.hSet(USER_SOCKET_HASH_KEY, userId, socketId);
};

const clearUserSocket = async (userId: number) => {
  await redisClient.hDel(USER_SOCKET_HASH_KEY, userId.toString());
};

const getUserSocket = async (userId: number): Promise<string | null> => {
  const socketId = await redisClient.hGet(
    USER_SOCKET_HASH_KEY,
    userId.toString()
  );
  return socketId ? socketId.toString() : null;
};

export { getUserSocket, setUserSocket, clearUserSocket };
