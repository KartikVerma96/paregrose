# Paregrose Project Setup Guide

This guide will help you set up the Paregrose project on a new Windows system.

## Prerequisites

Before starting, ensure you have the following installed on your system:

1. **Node.js** (v18 or higher) - [Download from nodejs.org](https://nodejs.org/)
2. **MySQL Server** - [Download from mysql.com](https://dev.mysql.com/downloads/mysql/)
3. **Git** - [Download from git-scm.com](https://git-scm.com/)

## Step 1: Clone the Repository

```bash
git clone <your-github-repo-url>
cd paregrose
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Database Setup

### 3.1 Create MySQL Database

1. Open MySQL Workbench or use command line
2. Create a new database:

```sql
CREATE DATABASE paregrose_db;
```

### 3.2 Configure Database Connection

1. Copy the environment file:
```bash
copy .env.example .env.local
```

2. Edit `.env.local` with your database credentials:
```env
DATABASE_URL="mysql://your_username:your_password@localhost:3306/paregrose_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters"
```

**Important:** Replace the following values:
- `your_username`: Your MySQL username
- `your_password`: Your MySQL password
- `paregrose_db`: Your database name
- `your-secret-key-here-minimum-32-characters`: A random secret key (at least 32 characters)

### 3.3 Import Database Data

**Option A: Import from existing database dump**
1. If you have a database dump file, import it:
```bash
mysql -u your_username -p paregrose_db < your_database_dump.sql
```

**Option B: Set up database schema and populate with sample data**
1. Generate Prisma client:
```bash
npm run db:generate
```

2. Push database schema:
```bash
npm run db:push
```

3. Populate with sample data:
```bash
npm run populate
```

4. Create admin users:
```bash
npm run create-admin
```

## Step 4: Google OAuth Setup (Optional)

If you want Google login functionality:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add the credentials to your `.env.local`:
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Step 5: Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Troubleshooting Login Issues

### Issue: "Invalid credentials" error

This is likely due to one of the following:

1. **Database connection issues:**
   - Check if MySQL server is running
   - Verify database credentials in `.env.local`
   - Ensure the database exists and has the correct schema

2. **Missing users in database:**
   - Run `npm run create-admin` to create admin users
   - Check if users exist in the database with correct provider type

3. **Environment variables not loaded:**
   - Ensure `.env.local` file exists and has correct values
   - Restart the development server after changing environment variables

4. **Database schema issues:**
   - Run `npm run db:generate` to regenerate Prisma client
   - Run `npm run db:push` to sync database schema

### Issue: Database connection errors

1. Check MySQL server status:
```bash
# Windows Command Prompt
net start mysql
```

2. Verify database credentials:
```bash
mysql -u your_username -p -e "SHOW DATABASES;"
```

3. Check if the database exists:
```bash
mysql -u your_username -p -e "USE paregrose_db; SHOW TABLES;"
```

### Issue: NextAuth errors

1. Ensure `NEXTAUTH_SECRET` is set and is at least 32 characters
2. Check that `NEXTAUTH_URL` matches your development URL
3. Verify all required environment variables are set

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:studio      # Open Prisma Studio

# Utility scripts
npm run populate       # Populate database with sample data
npm run create-admin   # Create admin users
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL database connection string |
| `NEXTAUTH_URL` | Yes | Base URL for NextAuth (usually http://localhost:3000) |
| `NEXTAUTH_SECRET` | Yes | Secret key for NextAuth (minimum 32 characters) |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `NODE_ENV` | No | Environment (development/production) |

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Update `NEXTAUTH_URL` to your production domain
3. Use a strong, unique `NEXTAUTH_SECRET`
4. Ensure your production database is properly configured
5. Run `npm run build` before starting the production server

## Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify all environment variables are correctly set
3. Ensure database connection is working
4. Check that all dependencies are installed
5. Verify Node.js version compatibility (v18+)

For additional support, check the project's GitHub issues or documentation.
