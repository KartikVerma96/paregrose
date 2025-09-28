-- Add role and other admin fields to existing user table
-- Run this SQL script in your MySQL database

USE paregrose_db;

-- Add new columns to user table
ALTER TABLE user 
ADD COLUMN role VARCHAR(20) DEFAULT 'customer',
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN last_login DATETIME NULL;

-- Update existing user to have customer role
UPDATE user SET role = 'customer' WHERE role IS NULL;

-- Create admin user manually
INSERT INTO user (fullName, email, password, role, is_active, provider, createdAt, updatedAt) VALUES
('Admin User', 'admin@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'admin', TRUE, 'credentials', NOW(), NOW()),
('Manager User', 'manager@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'manager', TRUE, 'credentials', NOW(), NOW()),
('Staff User', 'staff@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'staff', TRUE, 'credentials', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
role = VALUES(role),
is_active = VALUES(is_active);

-- Show created user
SELECT id, fullName, email, role, is_active FROM user WHERE role IN ('admin', 'manager', 'staff');
