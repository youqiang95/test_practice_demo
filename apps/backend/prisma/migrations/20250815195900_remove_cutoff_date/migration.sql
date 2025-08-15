/*
  Warnings:

  - You are about to drop the column `cutoffDate` on the `roidata` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `RoiData_cutoffDate_idx` ON `roidata`;

-- AlterTable
ALTER TABLE `roidata` DROP COLUMN `cutoffDate`;
