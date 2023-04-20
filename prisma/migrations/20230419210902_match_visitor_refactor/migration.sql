/*
  Warnings:

  - You are about to drop the column `visitantTeamId` on the `Match` table. All the data in the column will be lost.
  - Added the required column `visitorTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_visitantTeamId_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "visitantTeamId",
ADD COLUMN     "visitorTeamId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_visitorTeamId_fkey" FOREIGN KEY ("visitorTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
