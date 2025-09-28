-- Simple script to fix admin columns
USE paregrose_db;

-- Check if columns exist and add them if they don't
SET @sql = '';

-- Check for role column
SELECT COUNT(*) INTO @role_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'paregrose_db' 
AND TABLE_NAME = 'user' 
AND COLUMN_NAME = 'role';

-- Check for is_active column
SELECT COUNT(*) INTO @is_active_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'paregrose_db' 
AND TABLE_NAME = 'user' 
AND COLUMN_NAME = 'is_active';

-- Check for last_login column
SELECT COUNT(*) INTO @last_login_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'paregrose_db' 
AND TABLE_NAME = 'user' 
AND COLUMN_NAME = 'last_login';

-- Add role column if it doesn't exist
SET @sql = IF(@role_exists = 0, 'ALTER TABLE user ADD COLUMN role VARCHAR(20) DEFAULT ''customer''', '');
PREPARE stmt FROM @sql;
IF @sql != '' THEN EXECUTE stmt; END IF;
DEALLOCATE PREPARE stmt;

-- Add is_active column if it doesn't exist
SET @sql = IF(@is_active_exists = 0, 'ALTER TABLE user ADD COLUMN is_active BOOLEAN DEFAULT TRUE', '');
PREPARE stmt FROM @sql;
IF @sql != '' THEN EXECUTE stmt; END IF;
DEALLOCATE PREPARE stmt;

-- Add last_login column if it doesn't exist
SET @sql = IF(@last_login_exists = 0, 'ALTER TABLE user ADD COLUMN last_login DATETIME NULL', '');
PREPARE stmt FROM @sql;
IF @sql != '' THEN EXECUTE stmt; END IF;
DEALLOCATE PREPARE stmt;

-- Update existing users to have customer role
UPDATE user SET role = 'customer' WHERE role IS NULL OR role = '';

-- Insert admin user (with error handling)
INSERT IGNORE INTO user (fullName, email, password, role, is_active, provider, createdAt, updatedAt) VALUES
('Admin User', 'admin@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'admin', TRUE, 'credentials', NOW(), NOW());

-- Show the admin user
SELECT id, fullName, email, role, is_active FROM user WHERE email = 'admin@paregrose.com';
