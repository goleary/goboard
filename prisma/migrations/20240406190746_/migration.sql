/*
  Warnings:

  - A unique constraint covering the columns `[location,dateTime]` on the table `LakeRecord` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location,dateTime]` on the table `WeatherRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LakeRecord_location_dateTime_key" ON "LakeRecord"("location", "dateTime");

-- CreateIndex
CREATE UNIQUE INDEX "WeatherRecord_location_dateTime_key" ON "WeatherRecord"("location", "dateTime");
