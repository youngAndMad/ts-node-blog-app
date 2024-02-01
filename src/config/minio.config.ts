import { Client } from "minio";
import { ENV } from "./env.config";

const minioClient = new Client({
  endPoint: ENV.MINIO_ENDPOINT,
  port: ENV.MINIO_PORT,
  useSSL: ENV.MINIO_USE_SSL,
  accessKey: ENV.MINIO_ACCESS_KEY,
  secretKey: ENV.MINIO_SECRET_KEY,
});

export default minioClient;
