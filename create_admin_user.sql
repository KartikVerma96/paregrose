-- Create admin user if it doesn't exist
USE paregrose_db;

-- Check if admin user exists
SELECT id, fullName, email, role, is_active FROM user WHERE email = 'admin@paregrose.com';

-- If the above query returns no results, run this INSERT:
INSERT IGNORE INTO user (fullName, email, password, role, is_active, provider, createdAt, updatedAt) VALUES
('Admin User', 'admin@paregrose.com', '$2b$12$GAl9sNRwLjYeZwIRFFzfJOUCMwHgWN..nzRZpmS0Hg5ioFl0WaHTW', 'admin', TRUE, 'credentials', NOW(), NOW());

-- Verify the admin user was created
SELECT id, fullName, email, role, is_active FROM user WHERE email = 'admin@paregrose.com';
