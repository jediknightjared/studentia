import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AUTH_COOKIE_NAME, signToken, TOKEN_EXPIRATION } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);

    return NextResponse.json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return NextResponse.json({ error: "Failed to log out user" }, { status: 500 });
  }
}
