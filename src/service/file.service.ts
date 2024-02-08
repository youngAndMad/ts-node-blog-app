import minioClient from "../config/minio.config";
import log from "../provider/logger";
import prisma from "../config/prisma.config";
import { UploadedFile } from "express-fileupload";
import { Response } from "express";
import NotFoundError from "../model/error/not-found.error";

const USER_PROFILE_IMAGE_BUCKET = "user_profile_image_node";

const uploadUserAvatar = async (
  file: UploadedFile,
  userId: number
): Promise<void> => {
  await minioClient.putObject(
    USER_PROFILE_IMAGE_BUCKET,
    `${userId}.${getFileExtension(file)}`,
    file.data
  );

  log.info(`uploaded new profile image by user with id ${userId}`);
  await prisma.user.update({
    data: {
      avatar: file.name,
    },
    where: {
      id: userId,
    },
  });
};

const downloadUserAvatar = async (
  userId: number,
  res: Response
): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (user === null) {
    throw new NotFoundError("user", userId);
  }

  if (!user.avatar) {
    throw new NotFoundError("user-profile-image", userId);
  }

  const data = await minioClient.getObject(
    USER_PROFILE_IMAGE_BUCKET,
    user.avatar
  );

  res.setHeader("Content-disposition", `attachment; filename=${user.avatar}`);
  res.setHeader("Content-type", "application/octet-stream");

  data.pipe(res);
};

const getFileExtension = (file: UploadedFile) =>
  file.name.substring(file.name.lastIndexOf("."));

export { downloadUserAvatar, uploadUserAvatar };
