import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials authorize called with:", credentials.email);
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || user.provider !== "credentials") {
            console.error("Authorize error: User not found or invalid provider");
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            console.error("Authorize error: Invalid password");
            return null;
          }

          console.log("Authorize success for user:", user.email);
          return { id: user.id, name: user.fullName, email: user.email };
        } catch (error) {
          console.error("Authorize error:", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("SignIn callback:", { user, account });
      try {
        // For Google provider, handle user creation/authentication
        if (account.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          // If user exists, allow sign in
          if (existingUser) {
            console.log("Existing Google user signing in:", user.email);
            return true;
          }

          // If user doesn't exist, create new user
          console.log("Creating new user for Google sign-in");
          await prisma.user.create({
            data: {
              email: user.email,
              fullName: user.name || "Google User",
              provider: account.provider,
              providerId: account.providerAccountId,
            },
          });
          console.log("New user created:", user.email);
          return true;
        }

        // For credentials provider, allow sign in (validation handled in authorize)
        if (account.provider === "credentials") {
          return true;
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error.message);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // On initial sign-in, user object is provided
      if (user) {
        try {
          // Always get the database user ID to avoid precision issues with OAuth provider IDs
          let dbUserId = null;
          
          if (account?.provider === "google") {
            // For Google OAuth, look up user by email to get database ID
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true }
            });
            if (dbUser && typeof dbUser.id === 'number' && dbUser.id > 0) {
              dbUserId = dbUser.id;
            } else {
              console.error("Failed to find database user for Google OAuth:", user.email);
              throw new Error("User not found in database");
            }
          } else if (account?.provider === "credentials") {
            // For credentials provider, user.id is already the database ID
            if (typeof user.id === 'number' && user.id > 0 && user.id <= Number.MAX_SAFE_INTEGER) {
              dbUserId = user.id;
            } else {
              console.error("Invalid user ID from credentials provider:", user.id);
              throw new Error("Invalid user ID");
            }
          }
          
          // Validate the database user ID is within safe range
          if (dbUserId && dbUserId > 0 && dbUserId <= Number.MAX_SAFE_INTEGER) {
            token.id = dbUserId;
            // Store email in token for potential re-fetching if ID becomes invalid
            if (user.email) {
              token.email = user.email;
            }
          } else {
            console.error("Database user ID out of safe range:", dbUserId);
            throw new Error("Invalid database user ID");
          }
        } catch (error) {
          console.error("JWT callback error:", error.message);
          // Return null to prevent token creation with invalid ID
          return null;
        }
      } else if (token && token.id) {
        // On subsequent requests, validate existing token.id
        // If token.id is invalid (too large, wrong format), try to fix it
        const currentId = typeof token.id === 'string' ? parseInt(token.id, 10) : token.id;
        
        // Check if token ID is invalid (too large or NaN)
        if (isNaN(currentId) || currentId <= 0 || currentId > Number.MAX_SAFE_INTEGER) {
          console.warn("Invalid token ID detected, attempting to fix:", token.id);
          
          // If we have email in token, try to re-fetch user ID
          if (token.email) {
            try {
              const dbUser = await prisma.user.findUnique({
                where: { email: token.email },
                select: { id: true }
              });
              if (dbUser && typeof dbUser.id === 'number' && dbUser.id > 0) {
                token.id = dbUser.id;
                console.log("Fixed token ID from database:", token.id);
              }
            } catch (error) {
              console.error("Error fixing token ID:", error);
            }
          }
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      try {
        // Ensure ID is always a valid integer
        if (!token || !token.id) {
          console.error("No token ID found in session");
          return { error: "SessionError" };
        }
        
        // Validate token.id is a safe integer
        let userId = typeof token.id === 'string' 
          ? parseInt(token.id, 10) 
          : token.id;
        
        // Check if it's a valid safe integer
        if (isNaN(userId) || userId <= 0 || userId > Number.MAX_SAFE_INTEGER) {
          console.error("Invalid user ID in token:", token.id, "parsed as:", userId);
          
          // If token ID is invalid, try to re-fetch from database using email
          if (session?.user?.email) {
            try {
              const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
                select: { id: true }
              });
              if (dbUser && typeof dbUser.id === 'number' && dbUser.id > 0) {
                userId = dbUser.id;
                // Update token with correct ID for next request
                token.id = dbUser.id;
                console.log("Re-fetched user ID from database:", userId);
              } else {
                return { error: "SessionError" };
              }
            } catch (dbError) {
              console.error("Error re-fetching user ID:", dbError);
              return { error: "SessionError" };
            }
          } else {
            return { error: "SessionError" };
          }
        }
        
        // Final validation - ensure it's within MySQL INT range (though DB might use BIGINT)
        if (userId > 2147483647) {
          console.warn("User ID exceeds MySQL INT max, ensure database uses BIGINT:", userId);
        }
        
        session.user.id = userId;
        return session;
      } catch (error) {
        console.error("Session callback error:", error.message);
        return { error: "SessionError" };
      }
    },
  },
  pages: {
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };