import redisClient from "../config/redis.config";
import log from "../provider/logger";

const ONLINE_USERS_SET = "online-users";

export async function setOnline(userId: number) {
  try {
    await redisClient.sAdd(ONLINE_USERS_SET, userId.toString());
    log.info(`User with ID ${userId} is now online.`);
  } catch (error) {
    log.error(`Error setting user with ID ${userId} online: ${error}`);
  }
}

export async function setOffline(userId: number) {
  try {
    await redisClient.sRem(ONLINE_USERS_SET, userId.toString());
    log.info(`User with ID ${userId} is now offline.`);
  } catch (error) {
    log.error(`Error setting user with ID ${userId} offline: ${error}`);
  }
}

export async function getAllOnlineUsers(): Promise<number[]> {
  return (await redisClient.sMembers(ONLINE_USERS_SET)).map((s) => +s);
}
