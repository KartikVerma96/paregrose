# Server Deployment Guide

## Step-by-Step Server Setup

### 1. Check Prerequisites

```bash
# Check Node.js version (should be 18+)
node -v

# Check npm version
npm -v

# Check if MySQL is installed
mysql --version

# Check if Git is installed
git --version
```

### 2. Install Prerequisites (if needed)

**Install Node.js 18+ (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Install MySQL (if not installed):**
```bash
sudo apt update
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

**Install Git (if not installed):**
```bash
sudo apt install git -y
```

### 3. Clone the Repository

```bash
# Navigate to your desired directory (e.g., /var/www or /home/your-user)
cd /var/www  # or wherever you want the project

# Clone the repository
git clone https://github.com/KartikVerma96/paregrose.git
cd paregrose
```

### 4. Install Dependencies

```bash
# Install all dependencies
npm ci  # Use 'ci' for production (cleaner than 'install')
```

### 5. Set Up Database

**Create MySQL Database:**
```bash
# Login to MySQL
sudo mysql -u root -p

# In MySQL prompt, run:
CREATE DATABASE paregrose_db;
CREATE USER 'paregrose_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';
GRANT ALL PRIVILEGES ON paregrose_db.* TO 'paregrose_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Import Existing Database (with all tables and data):**
```bash
# Make sure you're in the paregrose directory
cd /var/www/paregrose  # or wherever you cloned the repo

# Import the SQL file (replace 'paregrose_user' and 'your_password' with your credentials)
mysql -u paregrose_user -p paregrose_db < paregrose_db.sql

# Or if using root:
mysql -u root -p paregrose_db < paregrose_db.sql
```

**Note:** The `paregrose_db.sql` file contains:
- Complete database schema (all tables)
- All existing data (products, categories, settings, etc.)
- Business settings and configurations
- This is the exact database you want to use on the server

### 6. Configure Environment Variables

```bash
# Create .env.local file
nano .env.local
```

**Add the following content:**
```env
# Database
DATABASE_URL="mysql://paregrose_user:your_strong_password_here@localhost:3306/paregrose_db"

# NextAuth Configuration
NEXTAUTH_URL="http://your-domain.com"  # or http://your-server-ip:3000
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters-long-random-string"

# Google OAuth (Optional - if you want Google login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Node Environment
NODE_ENV=production
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

**Generate a secure NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 7. Set Up Prisma

```bash
# Generate Prisma Client (required for the app to work with database)
npm run db:generate
```

**Important:** Since you're using the existing `paregrose_db.sql` file:
- ✅ Database schema and data are already imported
- ✅ No need to run `npm run db:push` (database already exists)
- ✅ No need to run `npm run populate` (data already exists)
- ⚠️ You may still need to create admin users if they don't exist in the SQL file

**Check if admin users exist:**
```bash
# Login to MySQL
mysql -u paregrose_user -p paregrose_db

# Check users table
SELECT id, email, name, role FROM user WHERE role = 'admin';
EXIT;
```

**Create admin users (if needed):**
```bash
npm run create-admin
```

### 9. Build the Project

```bash
# Build for production
npm run build
```

### 10. Start Production Server

**Option A: Direct Start (for testing)**
```bash
npm start
```

**Option B: Using PM2 (Recommended for production)**

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start npm --name "paregrose" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

**PM2 Useful Commands:**
```bash
pm2 list              # List all processes
pm2 logs paregrose     # View logs
pm2 restart paregrose # Restart app
pm2 stop paregrose    # Stop app
pm2 delete paregrose  # Remove from PM2
```

### 11. Configure Firewall (if needed)

```bash
# Allow port 3000 (or your chosen port)
sudo ufw allow 3000/tcp
sudo ufw reload
```

### 12. Set Up Nginx Reverse Proxy (Recommended)

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/paregrose
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/paregrose /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 13. Verify Deployment

1. **Check if the app is running:**
   ```bash
   curl http://localhost:3000
   ```

2. **Check PM2 status:**
   ```bash
   pm2 status
   ```

3. **Check logs:**
   ```bash
   pm2 logs paregrose --lines 50
   ```

## Troubleshooting

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u paregrose_user -p paregrose_db

# Check if MySQL is running
sudo systemctl status mysql
```

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build
```

### Permission Issues
```bash
# Fix ownership (replace 'your-user' with your username)
sudo chown -R your-user:your-user /var/www/paregrose
```

## Quick Reference Commands

```bash
# Update code from GitHub
cd /var/www/paregrose
git pull origin main
npm ci
npm run db:generate
npm run build
pm2 restart paregrose

# View logs
pm2 logs paregrose

# Check status
pm2 status
```

## Security Checklist

- [ ] Strong database password set
- [ ] NEXTAUTH_SECRET is random and secure (32+ characters)
- [ ] .env.local file has correct permissions (not world-readable)
- [ ] Firewall configured
- [ ] Nginx configured (if using)
- [ ] SSL certificate installed (Let's Encrypt recommended)
- [ ] Database user has minimal required privileges
- [ ] Regular backups configured

## Next Steps

1. Set up SSL certificate with Let's Encrypt (for HTTPS)
2. Configure automatic backups
3. Set up monitoring (PM2 Plus or similar)
4. Configure domain DNS if using a domain name
