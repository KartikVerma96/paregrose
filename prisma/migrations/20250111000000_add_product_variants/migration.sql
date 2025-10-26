-- CreateTable
CREATE TABLE `product_variants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `size` VARCHAR(20) NULL,
    `color` VARCHAR(50) NULL,
    `sku` VARCHAR(100) NULL,
    `stock_quantity` INTEGER NOT NULL DEFAULT 0,
    `price_adjustment` DECIMAL(10, 2) NULL DEFAULT 0.00,
    `is_active` BOOLEAN NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_product_variants_product`(`product_id`),
    INDEX `idx_product_variants_active`(`is_active`),
    UNIQUE INDEX `product_variants_product_size_color_unique`(`product_id`, `size`, `color`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

