import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env["JWT_SECRET"]!;

export const TOKEN_EXPIRATION = 7;
export const AUTH_COOKIE_NAME = "auth_token";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${TOKEN_EXPIRATION}d` });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Failed to verify token:", err);
    return null;
  }
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
