/*
  Warnings:

  - You are about to drop the column `waterTempFarenheit` on the `WaterRecord` table. All the data in the column will be lost.
  - You are about to drop the column `airTempFarenheit` on the `WeatherRecord` table. All the data in the column will be lost.
  - You are about to drop the column `windSpeedMph` on the `WeatherRecord` table. All the data in the column will be lost.
  - Added the required column `waterTempCelsius` to the `WaterRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `airTempCelsius` to the `WeatherRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `windSpeedMps` to the `WeatherRecord` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WaterRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "waterTempCelsius" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WaterRecord" ("createdAt", "dateTime", "id", "location", "updatedAt") SELECT "createdAt", "dateTime", "id", "location", "updatedAt" FROM "WaterRecord";
DROP TABLE "WaterRecord";
ALTER TABLE "new_WaterRecord" RENAME TO "WaterRecord";
CREATE UNIQUE INDEX "WaterRecord_location_dateTime_key" ON "WaterRecord"("location", "dateTime");
CREATE TABLE "new_WeatherRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "windSpeedMps" REAL NOT NULL,
    "windDirection" TEXT NOT NULL,
    "airTempCelsius" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_WeatherRecord" ("createdAt", "dateTime", "id", "location", "updatedAt", "windDirection") SELECT "createdAt", "dateTime", "id", "location", "updatedAt", "windDirection" FROM "WeatherRecord";
DROP TABLE "WeatherRecord";
ALTER TABLE "new_WeatherRecord" RENAME TO "WeatherRecord";
CREATE UNIQUE INDEX "WeatherRecord_location_dateTime_key" ON "WeatherRecord"("location", "dateTime");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
