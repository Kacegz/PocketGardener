-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Crop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldId" INTEGER NOT NULL,
    "spiecesId" INTEGER NOT NULL,
    "isGrowing" BOOLEAN NOT NULL DEFAULT false,
    "plantedTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Crop_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Crop_spiecesId_fkey" FOREIGN KEY ("spiecesId") REFERENCES "Spieces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Crop" ("fieldId", "id", "spiecesId") SELECT "fieldId", "id", "spiecesId" FROM "Crop";
DROP TABLE "Crop";
ALTER TABLE "new_Crop" RENAME TO "Crop";
CREATE TABLE "new_Spieces" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "growthDuration" INTEGER NOT NULL DEFAULT 1000
);
INSERT INTO "new_Spieces" ("icon", "id", "name") SELECT "icon", "id", "name" FROM "Spieces";
DROP TABLE "Spieces";
ALTER TABLE "new_Spieces" RENAME TO "Spieces";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
