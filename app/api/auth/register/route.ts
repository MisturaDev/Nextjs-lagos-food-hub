import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signAuthToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/auth/constants";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  phone?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RegisterBody;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const role = body.role;
    const phone = body.phone?.trim() || null;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
      },
    });

    const token = signAuthToken({
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: AUTH_TOKEN_MAX_AGE_SECONDS,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unable to register user." }, { status: 500 });
  }
}
