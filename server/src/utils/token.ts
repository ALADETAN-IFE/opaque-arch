import { ENV } from "@/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export const COOKIE_MAX_AGE_MS = 5 * 60 * 1000; // 5 minutes

export const generateToken = (email: string): string => {
  return jwt.sign({ email }, ENV.JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: "5m",
  });
};

export const verifyToken = (token: string): { email: string } | null => {
  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET!, {
      algorithms: ["HS256"],
    }) as JwtPayload;

    if (typeof decoded.email !== "string") return null;
    return { email: decoded.email };
  } catch {
    return null;
  }
};