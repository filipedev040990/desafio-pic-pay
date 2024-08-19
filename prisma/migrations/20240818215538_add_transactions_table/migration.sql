-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(191) NOT NULL,
    `walletId` VARCHAR(191) NOT NULL,
    `value` INTEGER NOT NULL,
    `transactionType` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `wallets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
