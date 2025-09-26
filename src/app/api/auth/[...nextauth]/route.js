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
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          console.error("SignIn error: Email already registered");
          return { error: "EmailAlreadyRegistered" };
        }

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
      } catch (error) {
        console.error("SignIn callback error:", error.message);
        return { error: "EmailAlreadyRegistered" };
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      try {
        session.user.id = token.id;
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