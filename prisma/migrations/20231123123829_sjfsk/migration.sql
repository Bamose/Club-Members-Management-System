/*
  Warnings:

  - You are about to drop the column `event_id` on the `Registration` table. All the data in the column will be lost.
  - Added the required column `eventId` to the `Registration` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Registration" (
    "registration_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "eventId" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "registration_status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event" ("event_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Registration_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "Member" ("user_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Registration" ("createdAt", "member_id", "registration_id", "registration_status", "updatedAt") SELECT "createdAt", "member_id", "registration_id", "registration_status", "updatedAt" FROM "Registration";
DROP TABLE "Registration";
ALTER TABLE "new_Registration" RENAME TO "Registration";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
