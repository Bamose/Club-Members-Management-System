/*
  Warnings:

  - You are about to drop the column `department_id` on the `Member` table. All the data in the column will be lost.
  - Added the required column `department_name` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Member" (
    "member_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "department_name" TEXT NOT NULL,
    CONSTRAINT "Member_department_name_fkey" FOREIGN KEY ("department_name") REFERENCES "Department" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("createdAt", "email", "first_name", "last_name", "member_id", "phone_number", "updatedAt", "user_id") SELECT "createdAt", "email", "first_name", "last_name", "member_id", "phone_number", "updatedAt", "user_id" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
CREATE UNIQUE INDEX "Member_user_id_key" ON "Member"("user_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
