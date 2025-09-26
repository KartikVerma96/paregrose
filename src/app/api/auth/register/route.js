import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { fullName, email, password } = await request.json();
    console.log("Register API called with:", { fullName, email });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error("Register error: Email already exists");
      return new Response(
        JSON.stringify({ message: "This email is already registered, try logging in." }),
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        provider: "credentials",
      },
    });

    console.log("User registered successfully:", user.email);
    return new Response(
      JSON.stringify({ message: "User registered successfully", userId: user.id }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Register API error:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to register user" }),
      { status: 500 }
    );
  }
}