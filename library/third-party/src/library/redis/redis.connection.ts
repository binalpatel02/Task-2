import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType | null = null;

export const getRedisClient = async () => {

    if (redisClient?.isOpen) {
        return redisClient;
    }

    const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

    redisClient = createClient({
        url: redisUrl
    });

    redisClient.on("error", (error) => {
        console.error("Redis Error:", error);
    });

    redisClient.on("connect", () => {
        console.log("Redis connecting...");
    });

    redisClient.on("ready", () => {
        console.log("Redis connected");
    });

    await redisClient.connect();

    return redisClient;
};