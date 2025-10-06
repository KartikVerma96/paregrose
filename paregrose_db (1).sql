-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 28, 2025 at 10:45 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `paregrose_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `business_settings`
--

CREATE TABLE `business_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_settings`
--

INSERT INTO `business_settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'whatsapp_business_number', '+1234567890', 'WhatsApp business number for receiving orders', '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(2, 'business_name', 'Paregrose', 'Business name for WhatsApp messages', '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(3, 'business_address', 'Your Business Address', 'Business address for delivery information', '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(4, 'business_hours', '10:00 AM - 8:00 PM', 'Business operating hours', '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(5, 'delivery_info', 'Free delivery on orders above ₹999', 'Delivery information and policies', '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(6, 'store.name', 'Paregrose', 'store name setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(7, 'store.description', 'Premium Ethnic Wear & Fashion', 'store description setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(8, 'store.email', 'info@paregrose.com', 'store email setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(9, 'store.phone', '+91 9876543210', 'store phone setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(10, 'store.address', '', 'store address setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(11, 'store.logo', '', 'store logo setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(12, 'store.favicon', '', 'store favicon setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(13, 'payment.razorpayKeyId', '', 'payment razorpayKeyId setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(14, 'payment.razorpayKeySecret', '', 'payment razorpayKeySecret setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(15, 'payment.upiId', '', 'payment upiId setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(16, 'payment.bankAccount', '', 'payment bankAccount setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(17, 'payment.enableRazorpay', 'false', 'payment enableRazorpay setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(18, 'payment.enableUPI', 'false', 'payment enableUPI setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(19, 'payment.enableCOD', 'true', 'payment enableCOD setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(20, 'shipping.freeShippingThreshold', '0', 'shipping freeShippingThreshold setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(21, 'shipping.shippingCost', '0', 'shipping shippingCost setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(22, 'shipping.estimatedDeliveryDays', '7', 'shipping estimatedDeliveryDays setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(23, 'shipping.enableFreeShipping', 'false', 'shipping enableFreeShipping setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(24, 'notifications.emailNotifications', 'true', 'notifications emailNotifications setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(25, 'notifications.smsNotifications', 'false', 'notifications smsNotifications setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(26, 'notifications.lowStockAlert', 'true', 'notifications lowStockAlert setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(27, 'notifications.orderNotifications', 'true', 'notifications orderNotifications setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(28, 'seo.metaTitle', 'Paregrose -  Premium Ethnic Wear & Fashion', 'seo metaTitle setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(29, 'seo.metaDescription', 'Discover exquisite ethnic wear at Paregrose. Premium sarees, lehengas, gowns, and traditional outfits for women.', 'seo metaDescription setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(30, 'seo.metaKeywords', 'ethnic wear, sarees, lehengas, gowns, traditional wear, women fashion', 'seo metaKeywords setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(31, 'seo.googleAnalyticsId', '', 'seo googleAnalyticsId setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23'),
(32, 'seo.facebookPixelId', '', 'seo facebookPixelId setting', '2025-09-28 14:37:49', '2025-09-28 14:44:23');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `selected_size` varchar(20) DEFAULT NULL,
  `selected_color` varchar(50) DEFAULT NULL,
  `price_at_time` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Sarees', 'sarees', 'Traditional Indian sarees for all occasions', NULL, 1, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(2, 'Lehengas', 'lehengas', 'Beautiful lehengas for weddings and festivals', NULL, 1, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(3, 'Gowns', 'gowns', 'Elegant gowns for parties and special events', NULL, 1, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(4, 'Kurtis', 'kurtis', 'Comfortable and stylish kurtis for daily wear', NULL, 1, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(5, 'Salwar Suits', 'salwar-suits', 'Traditional salwar suits for various occasions', NULL, 1, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(10, 'Mens', 'mens', 'menss', '', 1, '2025-09-28 12:35:22', '2025-09-28 12:35:22');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` varchar(191) DEFAULT NULL,
  `image_url` varchar(191) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updated_at` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','closed') DEFAULT 'new',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `unsubscribed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_percentage` decimal(5,2) DEFAULT 0.00,
  `sku` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `size_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`size_options`)),
  `color_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`color_options`)),
  `availability` enum('In Stock','Out of Stock','Limited Stock') DEFAULT 'In Stock',
  `stock_quantity` int(11) DEFAULT 0,
  `weight` decimal(8,2) DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dimensions`)),
  `care_instructions` text DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_bestseller` tinyint(1) DEFAULT 0,
  `is_new_arrival` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `meta_keywords` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `short_description`, `category_id`, `price`, `original_price`, `discount_percentage`, `sku`, `brand`, `material`, `size_options`, `color_options`, `availability`, `stock_quantity`, `weight`, `dimensions`, `care_instructions`, `is_featured`, `is_bestseller`, `is_new_arrival`, `is_active`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`) VALUES
(1, 'Elegant Silk Saree', 'elegant-silk-saree', 'Beautiful silk saree perfect for weddings and special occasions', NULL, 1, '2999.00', '3999.00', '0.00', 'PRG-SAR-001', 'Paregrose', 'Silk', '[\"S\", \"M\", \"L\"]', '[\"Red\", \"Blue\", \"Green\"]', 'In Stock', 50, NULL, NULL, NULL, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(2, 'Designer Lehenga', 'designer-lehenga', 'Stunning designer lehenga for festive occasions', NULL, 2, '4999.00', '6999.00', '0.00', 'PRG-LEH-001', 'Paregrose', 'Georgette', '[\"S\", \"M\", \"L\", \"XL\"]', '[\"Pink\", \"Purple\", \"Gold\"]', 'In Stock', 30, NULL, NULL, NULL, 1, 0, 0, 1, NULL, NULL, NULL, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(3, 'Party Gown', 'party-gown', 'Elegant party gown for evening events', NULL, 3, '1999.00', '2499.00', '0.00', 'PRG-GOW-001', 'Paregrose', 'Chiffon', '[\"S\", \"M\", \"L\"]', '[\"Black\", \"Navy\", \"Red\"]', 'In Stock', 25, NULL, NULL, NULL, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-28 11:45:18', '2025-09-28 11:45:18'),
(4, 'Silk Saree Collection', 'silk-saree-collection', 'Beautiful silk sarees with intricate designs', 'Premium silk sarees', 1, '2500.00', '3000.00', '0.00', 'SS001', 'Paregrose', NULL, NULL, NULL, 'In Stock', 15, NULL, NULL, NULL, 1, 1, 0, 1, NULL, NULL, NULL, '2025-09-28 12:20:26', '2025-09-28 12:20:26'),
(6, 'Cotton Kurti Set', 'cotton-kurti-set', 'Comfortable cotton kurti for daily wear', 'Cotton kurti', 4, '800.00', NULL, '0.00', 'CK001', 'Paregrose', NULL, NULL, NULL, 'In Stock', 25, NULL, NULL, NULL, 0, 1, 0, 1, NULL, NULL, NULL, '2025-09-28 12:20:26', '2025-09-28 12:20:26');

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `is_primary`, `sort_order`, `created_at`) VALUES
(1, 1, '/images/carousel/pic_1.jpg', 'Elegant Silk Saree - Front View', 1, 1, '2025-09-28 11:45:18'),
(2, 1, '/images/carousel/pic_2.jpg', 'Elegant Silk Saree - Side View', 0, 2, '2025-09-28 11:45:18'),
(3, 2, '/images/carousel/pic_3.jpg', 'Designer Lehenga - Front View', 1, 1, '2025-09-28 11:45:18'),
(4, 2, '/images/carousel/pic_4.jpg', 'Designer Lehenga - Detail View', 0, 2, '2025-09-28 11:45:18'),
(5, 3, '/images/carousel/pic_5.jpg', 'Party Gown - Front View', 1, 1, '2025-09-28 11:45:18'),
(6, 3, '/images/carousel/pic_6.jpg', 'Party Gown - Back View', 0, 2, '2025-09-28 11:45:18');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `title` varchar(200) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 1,
  `helpful_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `provider` varchar(191) DEFAULT 'credentials',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  `providerId` varchar(191) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'customer',
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fullName`, `email`, `password`, `provider`, `createdAt`, `updatedAt`, `providerId`, `role`, `is_active`, `last_login`) VALUES
(1, 'Kartik', 'kartikkokliw@gmail.com', NULL, 'google', '2025-09-26 19:47:45.145', '2025-09-26 19:47:45.145', '110051402434007040654', 'customer', 1, NULL),
(2, 'Kartik Verma', 'kartikkokli96@gmail.com', NULL, 'google', '2025-09-27 20:44:38.161', '2025-09-27 20:44:38.161', '114994850433863512524', 'customer', 1, NULL),
(3, 'Vivek', 'vivek@gmail.com', '$2b$10$WstcSMnvLDv/BdF4AVZV8u3jDGCFcq25lPMjr0gi3KoYad1I/ealq', 'credentials', '2025-09-28 08:08:43.848', '2025-09-28 08:08:43.848', NULL, 'customer', 1, NULL),
(4, 'Admin User', 'admin@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'credentials', '2025-09-28 18:05:59.000', '2025-09-28 18:05:59.000', NULL, 'admin', 1, '2025-09-28 20:33:02'),
(5, 'Manager User', 'manager@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'credentials', '2025-09-28 18:05:59.000', '2025-09-28 18:05:59.000', NULL, 'manager', 1, NULL),
(6, 'Staff User', 'staff@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'credentials', '2025-09-28 18:05:59.000', '2025-09-28 18:05:59.000', NULL, 'staff', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_orders`
--

CREATE TABLE `whatsapp_orders` (
  `id` int(11) NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `whatsapp_message` text NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('sent','received','confirmed','cancelled','completed') DEFAULT 'sent',
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `whatsapp_order_items`
--

CREATE TABLE `whatsapp_order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_sku` varchar(100) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `selected_size` varchar(20) DEFAULT NULL,
  `selected_color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('6c8099ee-4f96-438c-bfed-999ff6094698', '9ee7102816dd581c5f15749ffe1a31709ece7859942d1c99edff38e271285df1', '2025-09-25 15:37:31.133', '20250925153731_update_user_schema', NULL, NULL, '2025-09-25 15:37:31.096', 1),
('b7461c81-3f54-4006-9d80-fb3910aecc9e', 'd969a8dfec6f1827501e512b6d1257296ec4ce654d8c43953bdc263d6c9afd2f', '2025-09-22 18:10:20.712', '20250922181020_init', NULL, NULL, '2025-09-22 18:10:20.679', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `business_settings`
--
ALTER TABLE `business_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `idx_business_settings_key` (`setting_key`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_cart_items_session` (`session_id`),
  ADD KEY `idx_cart_items_user` (`user_id`),
  ADD KEY `idx_cart_items_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_contact_status` (`status`);

--
-- Indexes for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_newsletter_email` (`email`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_category` (`category_id`),
  ADD KEY `idx_products_price` (`price`),
  ADD KEY `idx_products_availability` (`availability`),
  ADD KEY `idx_products_featured` (`is_featured`),
  ADD KEY `idx_products_bestseller` (`is_bestseller`),
  ADD KEY `idx_products_active` (`is_active`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_images_product` (`product_id`),
  ADD KEY `idx_product_images_primary` (`is_primary`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_product` (`product_id`),
  ADD KEY `idx_reviews_user` (`user_id`),
  ADD KEY `idx_reviews_rating` (`rating`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `whatsapp_orders`
--
ALTER TABLE `whatsapp_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `order_id` (`order_id`),
  ADD KEY `idx_whatsapp_orders_user` (`user_id`),
  ADD KEY `idx_whatsapp_orders_status` (`status`),
  ADD KEY `idx_whatsapp_orders_order_id` (`order_id`);

--
-- Indexes for table `whatsapp_order_items`
--
ALTER TABLE `whatsapp_order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_whatsapp_order_items_order` (`order_id`),
  ADD KEY `idx_whatsapp_order_items_product` (`product_id`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_wishlist_items_user` (`user_id`),
  ADD KEY `idx_wishlist_items_product` (`product_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `business_settings`
--
ALTER TABLE `business_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `newsletter_subscribers`
--
ALTER TABLE `newsletter_subscribers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `whatsapp_orders`
--
ALTER TABLE `whatsapp_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `whatsapp_order_items`
--
ALTER TABLE `whatsapp_order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
