-- Check the current structure of your user table
USE paregrose_db;

-- Show table structure
DESCRIBE user;

-- Show all users with their roles
SELECT id, fullName, email, role, is_active, last_login FROM user;
