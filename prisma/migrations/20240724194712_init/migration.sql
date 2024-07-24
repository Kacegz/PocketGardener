-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discord_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Field" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Field_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Crop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldId" INTEGER NOT NULL,
    "spiecesId" INTEGER NOT NULL,
    CONSTRAINT "Crop_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Crop_spiecesId_fkey" FOREIGN KEY ("spiecesId") REFERENCES "Spieces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Spieces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discord_id_key" ON "User"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "Field_userId_key" ON "Field"("userId");
