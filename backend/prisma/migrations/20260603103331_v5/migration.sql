/*
  Warnings:

  - Added the required column `order` to the `Chart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chart" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ChartType" ALTER COLUMN "size" SET DEFAULT '4x4';
