import type { NextFunction, Request, Response } from "express";
import { getRedisClient } from "@library/third-party/redis";

interface RateLimitOptions {
    windowSeconds: number;
    maxRequests: number;
    keyPrefix?: string;
}

export const rateLimit = ({ windowSeconds, maxRequests, keyPrefix = "rate-limit",}: RateLimitOptions) => {

    return async ( req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const clientIp = req.ip || req.headers["x-forwarded-for"] ?.toString() .split(",")[0] || "unknown";

            const key = `${keyPrefix}:${clientIp}`;

            const redis = await getRedisClient();

            const currentCount = await redis.incr(key);

            console.log("RATE LIMIT DEBUG:", { key, currentCount, maxRequests });

            if (currentCount === 1) {
                await redis.expire(key, windowSeconds);
            }

            const remaining = Math.max( maxRequests - currentCount, 0 );

            res.setHeader("X-RateLimit-Limit", maxRequests);
            res.setHeader( "X-RateLimit-Remaining", remaining);

            if (currentCount > maxRequests) {
                const ttl = await redis.ttl(key);

                console.log("RATE LIMIT BLOCKED:", {  key,  currentCount,  maxRequests,  ttl });

                res.setHeader("Retry-After", ttl);

                res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later.",
                    retry_after: ttl,
                });

                return;
            }

            next();
        } catch (error) {
            console.error("Rate limit error:", error);

            res.status(503).json({
                success: false,
                message: "Rate limiting service is unavailable",
            });

            return;
        }
    };
};