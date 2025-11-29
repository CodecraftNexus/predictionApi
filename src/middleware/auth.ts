import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// ======================== IsDev ===========================
const isDev = env.NODE_ENV !== "production";

export interface AuthRequest extends Request {
  user?: { userId?: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = isDev 
    ? req.headers.authorization 
    : req.cookies?.access_token ? `Bearer ${req.cookies.access_token}` : undefined;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ 
        success: false, 
        message: "Missing or invalid Authorization header" 
      });
  }

  const token = auth.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET as string) as any;
    const userId = payload.userId ?? payload.sub;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token payload" 
      });
    }

    req.user = { userId };
    return next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
}