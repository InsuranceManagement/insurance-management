-- CreateTable
CREATE TABLE "ChartType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "size" TEXT NOT NULL DEFAULT '1x1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "apiRoute" TEXT NOT NULL,
    "chartTypeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChartType_name_key" ON "ChartType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Chart_name_key" ON "Chart"("name");

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_chartTypeId_fkey" FOREIGN KEY ("chartTypeId") REFERENCES "ChartType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
