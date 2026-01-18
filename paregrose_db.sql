-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 18, 2026 at 02:59 PM
-- Server version: 5.7.24
-- PHP Version: 7.4.16

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
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `business_settings`
--

INSERT INTO `business_settings` (`id`, `setting_key`, `setting_value`, `description`, `created_at`, `updated_at`) VALUES
(1, 'whatsapp_business_number', '+917042080984', 'WhatsApp business number for receiving orders', '2025-09-28 11:45:18', '2025-12-06 08:24:46'),
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
-- Table structure for table `carousel_slides`
--

CREATE TABLE `carousel_slides` (
  `id` int(11) NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtext` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `offer_text` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `button_text` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Shop Now',
  `button_link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT '/shop',
  `is_active` tinyint(1) DEFAULT '1',
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `carousel_slides`
--

INSERT INTO `carousel_slides` (`id`, `image_url`, `alt_text`, `title`, `subtext`, `offer_text`, `button_text`, `button_link`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
(1, '/images/carousel/carousel_1.jpg', 'Worldwide Shipping Banner', 'Worldwide Shipping', 'Get Free Gift On Prepaid Order', 'Get Up to 20% on Prepaid Orders', 'Shop Now', '/shop', 1, 0, '2025-12-06 07:29:47', '2025-12-06 07:59:37');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `selected_size` varchar(20) DEFAULT NULL,
  `selected_color` varchar(50) DEFAULT NULL,
  `price_at_time` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`id`, `session_id`, `user_id`, `product_id`, `quantity`, `selected_size`, `selected_color`, `price_at_time`, `created_at`, `updated_at`) VALUES
(5, 'user_4', 4, 3, 1, 'L', 'Green', '2222.00', '2025-10-12 14:54:43', '2025-10-12 14:54:43'),
(7, 'user_4', 4, 2, 1, NULL, NULL, '77.00', '2025-12-06 08:28:31', '2025-12-06 08:28:31'),
(8, 'user_4', 4, 1, 1, NULL, NULL, '33.00', '2025-12-06 08:28:32', '2025-12-06 08:28:32');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` text,
  `image_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `image_url`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Lehanga', 'lehanga', 'Lahanga Leloooo', '', 1, '2025-10-06 05:21:25', '2025-10-06 14:48:55'),
(2, 'Saree', 'saree', 'Saree lelo rang birangi', '', 1, '2025-10-06 08:45:17', '2025-10-06 14:57:06'),
(3, 'Gown', 'gown', 'Gown lelooo', '', 1, '2025-10-06 09:26:20', '2025-10-06 09:26:20'),
(4, 'Suit', 'suit', 'Suit lelo Laal imli se jaipur me', '', 1, '2025-10-06 09:26:51', '2025-10-06 18:40:56'),
(5, 'Dress', 'dress', 'Dres lelo, konsi loge ', '', 1, '2025-10-06 09:27:24', '2025-10-06 09:27:24'),
(6, 'Oxidised Jewellery', 'oxidised-jewellery', 'oxidised jewellery lelo guys', '', 1, '2025-10-06 09:27:58', '2025-10-06 09:27:58'),
(7, 'Home Decor', 'home-decor', 'Home Decor karwalo guys', '', 1, '2025-10-06 09:28:22', '2025-10-06 09:28:22');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
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
  `admin_notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `newsletter_subscribers`
--

CREATE TABLE `newsletter_subscribers` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `subscribed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text,
  `short_description` varchar(500) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `discount_percentage` decimal(5,2) DEFAULT '0.00',
  `sku` varchar(100) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `size_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `color_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `availability` enum('In Stock','Out of Stock','Limited Stock') DEFAULT 'In Stock',
  `stock_quantity` int(11) DEFAULT '0',
  `weight` decimal(8,2) DEFAULT NULL,
  `dimensions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `care_instructions` text,
  `is_featured` tinyint(1) DEFAULT '0',
  `is_bestseller` tinyint(1) DEFAULT '0',
  `is_new_arrival` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `meta_title` varchar(200) DEFAULT NULL,
  `meta_description` text,
  `meta_keywords` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subcategory_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `slug`, `description`, `short_description`, `category_id`, `price`, `original_price`, `discount_percentage`, `sku`, `brand`, `material`, `size_options`, `color_options`, `availability`, `stock_quantity`, `weight`, `dimensions`, `care_instructions`, `is_featured`, `is_bestseller`, `is_new_arrival`, `is_active`, `meta_title`, `meta_description`, `meta_keywords`, `created_at`, `updated_at`, `subcategory_id`) VALUES
(1, 'Lehanga1', 'lehanga1', 'fgjhk fytjhh gdfyhjkryu jdtyshj tdgyghj ', 'hgmjnfgh', 1, '33.00', '44.00', '0.00', NULL, 'Kuki', 'cotton', NULL, NULL, 'In Stock', 3, '0.22', NULL, 'bvsdfvdsfdsf', 0, 0, 0, 1, NULL, NULL, NULL, '2025-10-10 13:23:58', '2025-10-10 13:23:58', NULL),
(2, 'Ganga', 'ganga', '5ebyhr6 ygrhrtyh teyhj hrtgher', 'servyty', 5, '77.00', '88.00', '0.00', NULL, 'Rishi', 'cotton candy', '[\"28\",\"30\",\"32\",\"34\",\"36\"]', '[\"red\",\"blue\",\"green\",\"black\"]', 'In Stock', 3, '11.00', NULL, 'sdgfvb dfg edfadg erfg', 1, 0, 0, 1, NULL, NULL, NULL, '2025-10-10 13:24:52', '2025-10-12 20:29:16', NULL),
(3, 'Tuxedo Green', 'tuxedo-green', 'Long Description of suit', 'Short Description of suit', 4, '2222.00', '3333.00', '0.00', NULL, 'Manyawar', 'cotton', '[\"L\",\"M\",\"XL\",\"XXL\"]', '[\"Green\",\"Black\",\"Blue\"]', 'In Stock', 6, '2.00', NULL, 'Instruction', 1, 0, 1, 1, NULL, NULL, NULL, '2025-10-10 13:50:42', '2025-10-12 20:28:45', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_images`
--

CREATE TABLE `product_images` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `sort_order` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_images`
--

INSERT INTO `product_images` (`id`, `product_id`, `image_url`, `alt_text`, `is_primary`, `sort_order`, `created_at`) VALUES
(1, 1, '/uploads/products/1760122433528-wmjdmv-traveling-to-most-aesthetic-parts-of-india-1669972802.png', 'Lehanga1', 1, 2, '2025-10-10 13:23:58'),
(2, 1, '/uploads/products/1760122433415-au0yyh-pxfuel.jpg', 'Lehanga1', 0, 1, '2025-10-10 13:23:58'),
(3, 1, '/uploads/products/1760122433642-e1wkbw-wp2359324-bmw-drift-wallpapers.jpg', 'Lehanga1', 0, 3, '2025-10-10 13:23:58'),
(49, 3, '/uploads/products/1760124169242-t1s0ol-green_suit_tuxedo1.jpg', 'Tuxedo Green', 0, 2, '2025-10-12 14:58:45'),
(50, 3, '/uploads/products/1760124169107-wc1z2r-green_suit_tuxedo.jpg', 'Tuxedo Green', 1, 1, '2025-10-12 14:58:45'),
(51, 3, '/uploads/products/1760124169395-couiyn-green_suit_tuxedo2.jpg', 'Tuxedo Green', 0, 3, '2025-10-12 14:58:45'),
(52, 2, '/uploads/products/1760122487384-q3m8h6-screencapture-localhost-3000-2025-09-15-21_49_27.png', 'Ganga', 0, 1, '2025-10-12 14:59:17'),
(53, 2, '/uploads/products/1760122487488-xmom0v-wp2359324-bmw-drift-wallpapers.jpg', 'Ganga', 1, 2, '2025-10-12 14:59:17'),
(54, 2, '/uploads/products/1760122487578-f8ptod-Black-hole-a-region-of-spacetime.jpg', 'Ganga', 0, 3, '2025-10-12 14:59:17');

-- --------------------------------------------------------

--
-- Table structure for table `product_variants`
--

CREATE TABLE `product_variants` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sku` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT '0',
  `price_adjustment` decimal(10,2) DEFAULT '0.00',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_variants`
--

INSERT INTO `product_variants` (`id`, `product_id`, `size`, `color`, `sku`, `stock_quantity`, `price_adjustment`, `is_active`, `created_at`, `updated_at`) VALUES
(61, 3, 'L', 'Green', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(62, 3, 'L', 'Blue', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(63, 3, 'L', 'Black', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(64, 3, 'M', 'Green', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(65, 3, 'XL', 'Black', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(66, 3, 'XL', 'Green', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(67, 3, 'XXL', 'Blue', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(68, 3, 'M', 'Black', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(69, 3, 'M', 'Blue', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(70, 3, 'XXL', 'Black', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(71, 3, 'XL', 'Blue', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(72, 3, 'XXL', 'Green', NULL, 0, '0.00', 1, '2025-10-12 14:58:45', '2025-10-12 14:58:45'),
(73, 2, '28', 'green', NULL, 2, '11.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(74, 2, '28', 'black', NULL, 2, '11.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(75, 2, '30', 'black', NULL, 4, '22.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(76, 2, '30', 'blue', NULL, 4, '22.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(77, 2, '30', 'red', NULL, 4, '22.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(78, 2, '32', 'green', NULL, 0, '33.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(79, 2, '28', 'red', NULL, 2, '11.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(80, 2, '30', 'green', NULL, 4, '22.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(81, 2, '28', 'blue', NULL, 2, '11.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(82, 2, '32', 'blue', NULL, 1, '33.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(83, 2, '32', 'red', NULL, 0, '33.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(84, 2, '36', 'green', NULL, 8, '55.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(85, 2, '36', 'red', NULL, 8, '55.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(86, 2, '36', 'blue', NULL, 8, '55.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(87, 2, '32', 'black', NULL, 0, '33.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(88, 2, '34', 'red', NULL, 6, '44.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(89, 2, '34', 'black', NULL, 6, '44.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(90, 2, '34', 'green', NULL, 6, '44.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(91, 2, '34', 'blue', NULL, 6, '44.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17'),
(92, 2, '36', 'black', NULL, 8, '55.00', 1, '2025-10-12 14:59:17', '2025-10-12 14:59:17');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `comment` text,
  `is_approved` tinyint(1) DEFAULT '1',
  `helpful_count` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `category_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subcategories`
--

INSERT INTO `subcategories` (`id`, `name`, `slug`, `description`, `image_url`, `is_active`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Casual Dresses', 'casual-dresses', 'Comfortable everyday dresses', '', 1, 5, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(2, 'Party Dresses', 'party-dresses', 'Elegant dresses for special occasions', '', 1, 5, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(3, 'Formal Dresses', 'formal-dresses', 'Professional and formal wear', '', 1, 5, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(4, 'Evening Gowns', 'evening-gowns', 'Sophisticated evening wear', '', 1, 3, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(5, 'Cocktail Gowns', 'cocktail-gowns', 'Perfect for cocktail parties', '', 1, 3, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(6, 'Bridal Gowns', 'bridal-gowns', 'Beautiful bridal gowns', '', 1, 3, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(7, 'Wall Art', 'wall-art', 'Beautiful wall decorations', '', 1, 7, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(8, 'Candles', 'decorative-candles', 'Aromatic decorative candles', '', 1, 7, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(9, 'Vases', 'decorative-vases', 'Elegant decorative vases', '', 1, 7, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(11, 'Designer Lehanga', 'designer-lehanga', 'High-end designer lehangas', '', 1, 1, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(12, 'Wedding Lehanga', 'wedding-lehanga', 'Bridal and wedding lehangas', '', 1, 1, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(13, 'Necklaces', 'oxidised-necklaces', 'Beautiful oxidised necklaces', '', 1, 6, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(14, 'Earrings', 'oxidised-earrings', 'Elegant oxidised earrings', '', 1, 6, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(15, 'Bracelets', 'oxidised-bracelets', 'Stylish oxidised bracelets', '', 1, 6, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(16, 'Silk Sarees', 'silk-sarees', 'Premium silk sarees', '', 1, 2, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(17, 'Cotton Sarees', 'cotton-sarees', 'Comfortable cotton sarees', '', 1, 2, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(18, 'Georgette Sarees', 'georgette-sarees', 'Elegant georgette sarees', '', 1, 2, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(19, 'Formal Suits', 'formal-suits', 'Professional formal suits', '', 1, 4, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(20, 'Casual Suits', 'casual-suits', 'Relaxed casual suits', '', 1, 4, '2025-10-06 13:04:46', '2025-10-06 13:04:46'),
(21, 'Designer Suits', 'designer-suits', 'High-end designer suits', '', 1, 4, '2025-10-06 13:04:46', '2025-10-06 13:04:46');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'credentials',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) DEFAULT NULL,
  `providerId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `fullName`, `email`, `password`, `provider`, `createdAt`, `updatedAt`, `providerId`, `role`, `is_active`, `last_login`) VALUES
(1, 'Kartik', 'kartikkokliw@gmail.com', NULL, 'google', '2025-09-26 19:47:45.145', '2025-09-26 19:47:45.145', '110051402434007040654', 'customer', 1, NULL),
(2, 'Kartik Verma', 'kartikkokli96@gmail.com', NULL, 'google', '2025-09-27 20:44:38.161', '2025-09-27 20:44:38.161', '114994850433863512524', 'customer', 1, NULL),
(3, 'Vivek', 'vivek@gmail.com', '$2b$10$WstcSMnvLDv/BdF4AVZV8u3jDGCFcq25lPMjr0gi3KoYad1I/ealq', 'credentials', '2025-09-28 08:08:43.848', '2025-09-28 08:08:43.848', NULL, 'customer', 1, NULL),
(4, 'Admin User', 'admin@paregrose.com', '$2y$10$mo0RebFlIYvhG/epBAVsh.hGaa/ZQS0KQNDtXmzyeJlJQW0FNrng.', 'credentials', '2025-09-28 18:05:59.000', '2025-09-28 18:05:59.000', NULL, 'admin', 1, '2025-12-16 17:19:41'),
(5, 'Manager User', 'manager@paregrose.com', '$2a$12$Nsz0MeC6Bokeb/vCyGD5.eCwixJCL7OiHenYpcEHviXl5wH/wyGNO', 'credentials', '2025-09-28 18:05:59.000', '2025-09-28 18:05:59.000', NULL, 'admin', 1, '2025-10-12 18:12:40'),
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
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('481003a0-4e23-421d-ad50-2903159c12de', 'e37c2924b365923cc2fffaa67007b6e3c49512d32b88e336987f413b4239174b', '2025-12-06 12:55:38.981', '20250101000000_add_all_tables', '', NULL, '2025-12-06 12:55:38.981', 0),
('4eb59af2-e1ce-4408-aa90-4edcc304446f', 'e37c2924b365923cc2fffaa67007b6e3c49512d32b88e336987f413b4239174b', NULL, '20250101000000_add_all_tables', 'A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250101000000_add_all_tables\n\nDatabase error code: 1050\n\nDatabase error:\nTable \'category\' already exists\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20250101000000_add_all_tables\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name=\"20250101000000_add_all_tables\"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:236', '2025-12-06 12:55:38.979', '2025-10-11 18:24:55.233', 0),
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
-- Indexes for table `carousel_slides`
--
ALTER TABLE `carousel_slides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_carousel_slides_active` (`is_active`),
  ADD KEY `idx_carousel_slides_sort` (`sort_order`);

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
  ADD KEY `idx_products_active` (`is_active`),
  ADD KEY `idx_products_subcategory` (`subcategory_id`);

--
-- Indexes for table `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_images_product` (`product_id`),
  ADD KEY `idx_product_images_primary` (`is_primary`);

--
-- Indexes for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_variants_product_size_color_unique` (`product_id`,`size`,`color`),
  ADD KEY `idx_product_variants_product` (`product_id`),
  ADD KEY `idx_product_variants_active` (`is_active`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_reviews_product` (`product_id`),
  ADD KEY `idx_reviews_user` (`user_id`),
  ADD KEY `idx_reviews_rating` (`rating`);

--
-- Indexes for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `subcategory_name` (`name`),
  ADD UNIQUE KEY `subcategory_slug` (`slug`),
  ADD KEY `idx_subcategories_category` (`category_id`);

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
-- AUTO_INCREMENT for table `carousel_slides`
--
ALTER TABLE `carousel_slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `product_variants`
--
ALTER TABLE `product_variants`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

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

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `products_subcategory_id_fkey` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `product_images_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product_variants`
--
ALTER TABLE `product_variants`
  ADD CONSTRAINT `product_variants_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `wishlist_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
