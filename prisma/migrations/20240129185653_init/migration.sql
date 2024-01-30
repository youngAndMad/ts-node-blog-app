/*
  Warnings:

  - Changed the type of `otpSentTime` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "otpSentTime",
ADD COLUMN     "otpSentTime" TIMESTAMP(3) NOT NULL;
