# Quick Server Deployment Guide (Using Existing Database)

## Fast Track - Run These Commands on Your Server

### 1. Clone Repository
```bash
cd /var/www
git clone https://github.com/KartikVerma96/paregrose.git
cd paregrose
```

### 2. Install Dependencies
```bash
npm ci
```

### 3. Create Database & Import SQL File
```bash
# Create database and user
sudo mysql -u root -p
```
```sql
CREATE DATABASE paregrose_db;
CREATE USER 'paregrose_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON paregrose_db.* TO 'paregrose_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Import the existing database (with all tables and data)
mysql -u paregrose_user -p paregrose_db < paregrose_db.sql
```

### 4. Create Environment File
```bash
nano .env.local
```

**Add this content:**
```env
DATABASE_URL="mysql://paregrose_user:your_strong_password@localhost:3306/paregrose_db"
NEXTAUTH_URL="http://your-server-ip:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NODE_ENV=production
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### 5. Generate Prisma Client
```bash
npm run db:generate
```

### 6. Build & Start
```bash
npm run build
npm start
```

### 7. Install PM2 (Recommended)
```bash
sudo npm install -g pm2
pm2 start npm --name "paregrose" -- start
pm2 save
pm2 startup  # Follow instructions
```

---

## Important Notes

✅ **Database is already set up** - The `paregrose_db.sql` file contains:
- All tables (products, categories, users, cart_items, etc.)
- All existing data
- Business settings
- Product data

❌ **Don't run these commands:**
- `npm run db:push` (database already exists)
- `npm run populate` (data already exists)

✅ **You may need to:**
- Create admin users: `npm run create-admin` (if not in SQL file)
- Update `NEXTAUTH_URL` to your actual domain/IP
- Configure firewall: `sudo ufw allow 3000/tcp`

---

## Verify Database Import

```bash
mysql -u paregrose_user -p paregrose_db
```

```sql
SHOW TABLES;
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM user;
EXIT;
```

---

## Troubleshooting

**Database import error:**
```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Re-import if needed
mysql -u paregrose_user -p paregrose_db < paregrose_db.sql
```

**Prisma client error:**
```bash
# Regenerate Prisma client
npm run db:generate
```

**Port already in use:**
```bash
# Find and kill process on port 3000
sudo lsof -i :3000
sudo kill -9 <PID>
```
