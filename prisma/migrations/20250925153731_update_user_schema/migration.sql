-- AlterTable
ALTER TABLE `user` ADD COLUMN `providerId` VARCHAR(191) NULL,
    MODIFY `updatedAt` DATETIME(3) NULL;
