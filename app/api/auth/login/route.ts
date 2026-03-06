import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { comparePassword } from "@/lib/auth/password";
import { signAuthToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_MAX_AGE_SECONDS } from "@/lib/auth/constants";

type LoginBody = {
  email?: string;
  password?: string;
  role?: UserRole;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";
    const role = body.role;

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required." }, { status: 400 });
    }

    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (user.role !== role) {
      return NextResponse.json({ error: "Selected role does not match this account." }, { status: 403 });
    }

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
    return NextResponse.json({ error: "Unable to log in." }, { status: 500 });
  }
}
