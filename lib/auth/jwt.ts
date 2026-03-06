import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { AUTH_TOKEN_MAX_AGE_SECONDS } from "./constants";

export type AuthTokenPayload = {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
};

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return "dev-only-jwt-secret-change-me";
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: AUTH_TOKEN_MAX_AGE_SECONDS,
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
}
