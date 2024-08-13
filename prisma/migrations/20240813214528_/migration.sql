-- AlterTable
ALTER TABLE `requests` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `requests` ADD CONSTRAINT `requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
