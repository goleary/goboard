/*
  Warnings:

  - You are about to drop the `LakeRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LakeRecord";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "WaterRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "waterTempFarenheit" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "WaterRecord_location_dateTime_key" ON "WaterRecord"("location", "dateTime");
