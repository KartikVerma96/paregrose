# Deployment Notes

## Minification Error Prevention

To prevent errors like "d is not a function", "f is not a function", "a is not a function" during production builds, the following configurations have been applied:

### 1. Next.js Configuration (`next.config.mjs`)
- Configured SWC compiler to preserve function names and class names
- Enabled `optimizePackageImports` for better tree-shaking
- Added webpack optimizations for production builds
- Enabled React Strict Mode for better error detection

### 2. SWC Configuration (`.swcrc`)
- Set `keepClassNames: true` and `keepFunctionNames: true` in minify settings
- Configured mangle options to preserve function names
- This ensures function names are not shortened during minification

### 3. Code Best Practices Applied
- All React hooks are used correctly (not inside callbacks)
- Proper "use client" directives where needed
- Error handling for API calls
- Session loading checks before cart/wishlist operations

## Dependency Updates

### ✅ Updated (Minor/Patch Versions)
- `next`: ^15.4.6 → ^15.5.9 (Security patch - fixes critical vulnerabilities)
- `eslint-config-next`: ^15.4.6 → ^15.5.9 (Updated to match Next.js)
- `@prisma/client`: ^6.16.2 → ^6.19.2
- `@reduxjs/toolkit`: ^2.9.0 → ^2.11.2
- `bcryptjs`: ^3.0.2 → ^3.0.3
- `framer-motion`: ^12.23.12 → ^12.26.2
- `lucide-react`: ^0.544.0 → ^0.562.0
- `next-auth`: ^4.24.11 → ^4.24.13
- `react`: ^19.1.0 → ^19.2.3
- `react-dom`: ^19.1.0 → ^19.2.3
- `react-hook-form`: ^7.63.0 → ^7.71.1
- `recharts`: ^3.2.1 → ^3.6.0
- `zod`: ^4.1.11 → ^4.3.5
- `@eslint/eslintrc`: ^3 → ^3.3.3
- `@tailwindcss/postcss`: ^4.1.12 → ^4.1.18
- `eslint`: ^9 → ^9.39.2
- `prisma`: ^6.16.2 → ^6.19.2
- `tailwindcss`: ^4.1.12 → ^4.1.18

**Security:** All security vulnerabilities have been fixed (0 vulnerabilities found).

### ⚠️ Available but NOT Updated (Major Versions - Requires Testing)
- `next`: 15.4.6 → 16.1.3 (Major version - breaking changes)
- `eslint-config-next`: 15.4.6 → 16.1.3 (Major version - requires Next.js 16)
- `@prisma/client`: 6.19.2 → 7.2.0 (Major version - breaking changes)
- `prisma`: 6.19.2 → 7.2.0 (Major version - breaking changes)

**Note:** Major version updates should be tested thoroughly before deployment as they may include breaking changes.

## Build Process

Before deploying, ensure:

1. **Clean install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Run build:**
   ```bash
   npm run build
   ```

3. **Verify no errors:**
   - Check console for any minification warnings
   - Test all major features (login, cart, checkout, admin)
   - Verify API routes work correctly

4. **Production deployment:**
   ```bash
   npm ci  # Use ci instead of install for production
   npm run build
   npm start
   ```

## Environment Variables Required

Make sure these are set in production:
- `DATABASE_URL` - MySQL connection string
- `NEXTAUTH_URL` - Production URL
- `NEXTAUTH_SECRET` - Secret key (min 32 characters)
- `GOOGLE_CLIENT_ID` - (Optional) For Google OAuth
- `GOOGLE_CLIENT_SECRET` - (Optional) For Google OAuth
- `NODE_ENV=production`

## Troubleshooting

If you still encounter minification errors:

1. Check browser console for specific error messages
2. Verify all components have proper "use client" directives
3. Ensure no hooks are called inside callbacks
4. Check for any dynamic imports that might be causing issues
5. Review `.swcrc` configuration if needed

## Future Major Version Updates

When ready to update major versions:

1. **Next.js 16:**
   - Review migration guide: https://nextjs.org/docs/app/building-your-application/upgrading/version-16
   - Test all routes and API endpoints
   - Update any deprecated APIs

2. **Prisma 7:**
   - Review migration guide: https://www.prisma.io/docs/guides/upgrade-guides
   - Run `prisma migrate` to update schema
   - Test all database operations
