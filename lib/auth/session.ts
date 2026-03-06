import { UserRole } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "./constants";
import { AuthTokenPayload, verifyAuthToken } from "./jwt";

export async function getSessionUser(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function requireRole(role: UserRole) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== role) {
    redirect(`/${user.role}`);
  }

  return user;
}
