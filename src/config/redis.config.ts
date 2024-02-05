import { createClient } from "redis";
import { ENV } from "./env.config";

const redisClient = createClient({
  url: ENV.REDIS_URL,
});

export default redisClient;
