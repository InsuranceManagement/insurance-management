-- AlterTable
ALTER TABLE "Chart" ADD COLUMN     "unit" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
