import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/constants";
import { verifyAuthToken } from "@/lib/auth/jwt";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const user = verifyAuthToken(token);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
