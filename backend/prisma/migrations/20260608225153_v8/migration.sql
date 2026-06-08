/*
  Warnings:

  - You are about to drop the column `passwordRequestedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "passwordRequestedAt",
ADD COLUMN     "passwordResetRequestedAt" TIMESTAMP(3);
