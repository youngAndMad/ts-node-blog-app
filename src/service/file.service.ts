import { UserProfileImage } from "@prisma/client";
import minioClient from "../config/minio.config";
import log from "../provider/logger";
import prisma from "../config/prisma.config";
import { UploadedFile } from "express-fileupload";
import { Readable } from "stream";

const USER_PROFILE_IMAGE_BUCKET = "user_profile_image_node";

export async function uploadUserAvatar(
  file: UploadedFile,
  userId: number
): Promise<UserProfileImage> {
  await minioClient.putObject(
    USER_PROFILE_IMAGE_BUCKET,
    `${userId}.${getFileExtension(file)}`,
    file.data
  );

  return prisma.userProfileImage.create({
    data: {
      userId: userId,
      url: `/api/v1/file/download/profile-image/${userId}`,
    },
  });
}

export async function downloadUserAvatar(
  userId: number
): Promise<Readable | null> {
  const userProfileImage = await prisma.userProfileImage.findFirst({
    where: { userId: userId },
  });

  if (userProfileImage === null) {
    throw new Error("user profile not found");
  }
  return await minioClient.getObject(
    USER_PROFILE_IMAGE_BUCKET,
    userProfileImage?.url.substring(userProfileImage.url.lastIndexOf("/"))
  );
}

const getFileExtension = (file: UploadedFile) =>
  file.name.substring(file.name.lastIndexOf("."));
