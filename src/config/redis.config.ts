import { createClient } from "redis";
import { ENV } from "./env.config";

const client = createClient({
  url: ENV.REDIS_URL,
});

export default client;
