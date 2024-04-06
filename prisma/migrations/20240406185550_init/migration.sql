-- CreateTable
CREATE TABLE "WeatherRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "windSpeedMph" REAL NOT NULL,
    "windDirection" TEXT NOT NULL,
    "airTempFarenheit" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LakeRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "dateTime" DATETIME NOT NULL,
    "waterTempFarenheit" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
