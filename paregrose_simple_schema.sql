-- Paregrose Database Schema (Simple Version - No Foreign Keys)
-- This creates tables without foreign key constraints first
-- Run this to create all tables, then we can add constraints later

-- Step 1: Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 2: Create Products Table (no foreign key to categories yet)
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    category_id INT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    brand VARCHAR(100),
    material VARCHAR(100),
    size_options JSON,
    color_options JSON,
    availability ENUM('In Stock', 'Out of Stock', 'Limited Stock') DEFAULT 'In Stock',
    stock_quantity INT DEFAULT 0,
    weight DECIMAL(8, 2),
    dimensions JSON,
    care_instructions TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 3: Create Product Images Table (no foreign key to products yet)
CREATE TABLE IF NOT EXISTS product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 4: Create Cart Items Table (no foreign keys yet)
CREATE TABLE IF NOT EXISTS cart_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(100) NOT NULL,
    user_id INT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    price_at_time DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 5: Create Wishlist Items Table (no foreign keys yet)
CREATE TABLE IF NOT EXISTS wishlist_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Create WhatsApp Orders Table (no foreign keys yet)
CREATE TABLE IF NOT EXISTS whatsapp_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    user_id INT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(100),
    whatsapp_message TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('sent', 'received', 'confirmed', 'cancelled', 'completed') DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 7: Create WhatsApp Order Items Table (no foreign keys yet)
CREATE TABLE IF NOT EXISTS whatsapp_order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(100),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    selected_size VARCHAR(20),
    selected_color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 8: Create Reviews Table (no foreign keys yet)
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 9: Create Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL
);

-- Step 10: Create Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 11: Create Business Settings Table
CREATE TABLE IF NOT EXISTS business_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Step 12: Create Basic Indexes (without foreign key constraints)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(is_primary);

CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_user ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product ON wishlist_items(product_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_user ON whatsapp_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_status ON whatsapp_orders(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_orders_order_id ON whatsapp_orders(order_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_order_items_order ON whatsapp_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_order_items_product ON whatsapp_order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_business_settings_key ON business_settings(setting_key);

-- Step 13: Insert Sample Data
INSERT IGNORE INTO categories (name, slug, description) VALUES
('Sarees', 'sarees', 'Traditional Indian sarees for all occasions'),
('Lehengas', 'lehengas', 'Beautiful lehengas for weddings and festivals'),
('Gowns', 'gowns', 'Elegant gowns for parties and special events'),
('Kurtis', 'kurtis', 'Comfortable and stylish kurtis for daily wear'),
('Salwar Suits', 'salwar-suits', 'Traditional salwar suits for various occasions');

INSERT IGNORE INTO products (name, slug, description, category_id, price, original_price, sku, brand, material, size_options, color_options, availability, stock_quantity, is_featured, is_bestseller) VALUES
('Elegant Silk Saree', 'elegant-silk-saree', 'Beautiful silk saree perfect for weddings and special occasions', 1, 2999.00, 3999.00, 'PRG-SAR-001', 'Paregrose', 'Silk', '["S", "M", "L"]', '["Red", "Blue", "Green"]', 'In Stock', 50, TRUE, TRUE),
('Designer Lehenga', 'designer-lehenga', 'Stunning designer lehenga for festive occasions', 2, 4999.00, 6999.00, 'PRG-LEH-001', 'Paregrose', 'Georgette', '["S", "M", "L", "XL"]', '["Pink", "Purple", "Gold"]', 'In Stock', 30, TRUE, FALSE),
('Party Gown', 'party-gown', 'Elegant party gown for evening events', 3, 1999.00, 2499.00, 'PRG-GOW-001', 'Paregrose', 'Chiffon', '["S", "M", "L"]', '["Black", "Navy", "Red"]', 'In Stock', 25, FALSE, TRUE);

INSERT IGNORE INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
(1, '/images/carousel/pic_1.jpg', 'Elegant Silk Saree - Front View', TRUE, 1),
(1, '/images/carousel/pic_2.jpg', 'Elegant Silk Saree - Side View', FALSE, 2),
(2, '/images/carousel/pic_3.jpg', 'Designer Lehenga - Front View', TRUE, 1),
(2, '/images/carousel/pic_4.jpg', 'Designer Lehenga - Detail View', FALSE, 2),
(3, '/images/carousel/pic_5.jpg', 'Party Gown - Front View', TRUE, 1),
(3, '/images/carousel/pic_6.jpg', 'Party Gown - Back View', FALSE, 2);

-- Insert business settings
INSERT IGNORE INTO business_settings (setting_key, setting_value, description) VALUES
('whatsapp_business_number', '+1234567890', 'WhatsApp business number for receiving orders'),
('business_name', 'Paregrose', 'Business name for WhatsApp messages'),
('business_address', 'Your Business Address', 'Business address for delivery information'),
('business_hours', '10:00 AM - 8:00 PM', 'Business operating hours'),
('delivery_info', 'Free delivery on orders above ₹999', 'Delivery information and policies');

-- Success message
SELECT 'All tables created successfully without foreign key constraints!' as message;
