import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({
      where: {
        email,
        passwordHash: hashedPassword
      }
    });

    if (user === null) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

    const token = signToken({ userId: user.id });

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return NextResponse.json({ error: "Failed to log in user" }, { status: 500 });
  }
}
