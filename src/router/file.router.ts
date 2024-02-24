import express, { Request, Response } from "express";
import { uploadUserAvatar, downloadUserAvatar } from "../service/file.service";
import fileUpload from "express-fileupload";
import asyncTryCatchMiddleware from "../middleware/handle-error.middleware";

const fileRouter = express.Router();

fileRouter.post(
  "/upload/profile-image/:userId",
  fileUpload(),
  asyncTryCatchMiddleware(async (req: Request, res: Response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const file = req.files.file as fileUpload.UploadedFile;

    const uploadedAvatar = await uploadUserAvatar(file, +req.params.userId);
    res.json(uploadedAvatar);
  })
);

fileRouter.get(
  "/download/profile-image/:userId",
  asyncTryCatchMiddleware(async (req: Request, res: Response) => {
    await downloadUserAvatar(+req.params.userId, res);
  })
);

export default fileRouter;
