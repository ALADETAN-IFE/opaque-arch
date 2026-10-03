import { Request, Response, NextFunction } from "express";
import { logger, verifyToken } from "@/utils";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    logger.info("Auth/middleware", "authenticating")
    const token = req.cookies?.['opaque-sid'] as string | undefined;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    req.user = payload;
    next();
};