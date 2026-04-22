import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, comparePasswords, hashPassword, signToken, TOKEN_EXPIRATION } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const token = await login(email, password);

    return NextResponse.json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json({ error: "Failed to log in user" }, { status: 500 });
  }
}

export async function login(email: string, password: string) {
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (user === null) throw new Error("Invalid email");

  const isMatch = await comparePasswords(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid password");

  const token = signToken({ userId: user.id });

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * TOKEN_EXPIRATION,
    path: "/"
  });

  return token;
}
