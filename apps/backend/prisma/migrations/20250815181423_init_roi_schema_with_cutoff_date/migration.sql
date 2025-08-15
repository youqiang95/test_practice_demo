-- CreateTable
CREATE TABLE `RoiData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `cutoffDate` DATE NOT NULL,
    `app` VARCHAR(191) NOT NULL,
    `bidType` VARCHAR(191) NOT NULL DEFAULT 'CPI',
    `country` VARCHAR(191) NOT NULL,
    `installs` INTEGER NOT NULL,
    `dailyRoi` DOUBLE NOT NULL,
    `roi1d` DOUBLE NOT NULL,
    `roi3d` DOUBLE NOT NULL,
    `roi7d` DOUBLE NOT NULL,
    `roi14d` DOUBLE NOT NULL,
    `roi30d` DOUBLE NOT NULL,
    `roi60d` DOUBLE NOT NULL,
    `roi90d` DOUBLE NOT NULL,

    INDEX `RoiData_app_country_date_idx`(`app`, `country`, `date`),
    INDEX `RoiData_date_idx`(`date`),
    INDEX `RoiData_cutoffDate_idx`(`cutoffDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
