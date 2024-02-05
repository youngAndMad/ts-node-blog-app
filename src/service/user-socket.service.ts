import redisClient from "../config/redis.config";

const USER_SOCKET_HASH_KEY = "user-socket";

export async function setUserSocket(userId: number, socketId: any) {
  await redisClient.hSet(USER_SOCKET_HASH_KEY, userId, socketId);
}

export async function clearUserSocket(userId: number) {
  await redisClient.hDel(USER_SOCKET_HASH_KEY, userId.toString());
}

export async function getUserSocket(userId: number): Promise<string | null> {
  const socketId = await redisClient.hGet(
    USER_SOCKET_HASH_KEY,
    userId.toString()
  );
  return socketId ? socketId.toString() : null;
}
