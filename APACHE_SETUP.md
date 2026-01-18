# Apache & phpMyAdmin Setup Guide

## Quick Setup for www.freereelsdownload.com

### 1. Install Apache and phpMyAdmin

```bash
# Install Apache
sudo apt update
sudo apt install apache2 -y

# Install PHP and extensions
sudo apt install php php-mysql php-mbstring php-zip php-gd php-json php-curl -y

# Install phpMyAdmin
sudo apt install phpmyadmin -y
# During installation:
# - Select Apache2
# - Select Yes for dbconfig-common
# - Enter password (or leave blank)
# - Select Yes to configure database

# Enable Apache modules
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo systemctl restart apache2
```

### 2. Configure Apache for Paregrose

```bash
# Create virtual host
sudo nano /etc/apache2/sites-available/paregrose.conf
```

**Add this configuration:**
```apache
<VirtualHost *:80>
    ServerName www.freereelsdownload.com
    ServerAlias freereelsdownload.com
    
    # Proxy to Next.js app
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
    
    # WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:3000/$1" [P,L]
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/paregrose_error.log
    CustomLog ${APACHE_LOG_DIR}/paregrose_access.log combined
</VirtualHost>
```

**Enable site:**
```bash
sudo a2ensite paregrose.conf
sudo a2dissite 000-default.conf  # Optional: disable default
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### 3. Secure phpMyAdmin

```bash
# Install apache2-utils
sudo apt install apache2-utils -y

# Create password file
sudo htpasswd -c /etc/apache2/.htpasswd admin
# Enter password when prompted

# Edit phpMyAdmin config
sudo nano /etc/apache2/conf-available/phpmyadmin.conf
```

**Add at the top:**
```apache
<Directory /usr/share/phpmyadmin>
    Options SymLinksIfOwnerMatch
    DirectoryIndex index.php
    AllowOverride All
    
    # Password protection
    AuthType Basic
    AuthName "Restricted Access"
    AuthUserFile /etc/apache2/.htpasswd
    Require valid-user
</Directory>
```

**Restart Apache:**
```bash
sudo systemctl restart apache2
```

### 4. Install SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Get SSL certificate
sudo certbot --apache -d www.freereelsdownload.com -d freereelsdownload.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Redirect HTTP to HTTPS: Yes
```

### 5. Update Environment Variables

```bash
cd /var/www/paregrose
nano .env.local
```

**Update NEXTAUTH_URL:**
```env
NEXTAUTH_URL="https://www.freereelsdownload.com"
```

**Restart PM2:**
```bash
pm2 restart paregrose
```

### 6. Access Points

- **Website:** https://www.freereelsdownload.com
- **phpMyAdmin:** https://www.freereelsdownload.com/phpmyadmin
  - First login: Apache password (admin)
  - Second login: MySQL credentials (paregrose_user)

### 7. Troubleshooting

**Check Apache status:**
```bash
sudo systemctl status apache2
sudo apache2ctl configtest
```

**View Apache logs:**
```bash
sudo tail -f /var/log/apache2/paregrose_error.log
sudo tail -f /var/log/apache2/error.log
```

**Check if Next.js is running:**
```bash
pm2 status
curl http://localhost:3000
```

**Restart services:**
```bash
sudo systemctl restart apache2
pm2 restart paregrose
```

### 8. Security Notes

✅ **phpMyAdmin is password protected** (Apache Basic Auth)
✅ **SSL certificate installed** (HTTPS enabled)
✅ **Firewall configured** (ports 80, 443)
⚠️ **Consider restricting phpMyAdmin by IP** for additional security

**To restrict phpMyAdmin by IP:**
```bash
sudo nano /etc/apache2/conf-available/phpmyadmin.conf
```

Add before `Require valid-user`:
```apache
Require ip YOUR_SERVER_IP
Require ip YOUR_HOME_IP
Require valid-user
```
