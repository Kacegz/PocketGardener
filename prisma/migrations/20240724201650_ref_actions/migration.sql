-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Crop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fieldId" INTEGER NOT NULL,
    "spiecesId" INTEGER NOT NULL,
    CONSTRAINT "Crop_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "Field" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Crop_spiecesId_fkey" FOREIGN KEY ("spiecesId") REFERENCES "Spieces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Crop" ("fieldId", "id", "spiecesId") SELECT "fieldId", "id", "spiecesId" FROM "Crop";
DROP TABLE "Crop";
ALTER TABLE "new_Crop" RENAME TO "Crop";
CREATE TABLE "new_Field" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Field_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Field" ("id", "userId") SELECT "id", "userId" FROM "Field";
DROP TABLE "Field";
ALTER TABLE "new_Field" RENAME TO "Field";
CREATE UNIQUE INDEX "Field_userId_key" ON "Field"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
