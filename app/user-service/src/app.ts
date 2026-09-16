import express from "express";
import { rateLimit, errorHandler } from "@library/shared";
import v1Router from "./api/v1/index.js";

const app = express();

app.use(express.json());

// General API rate limit
app.use(
    rateLimit({
        windowSeconds: 60,
        maxRequests: 60,
        keyPrefix: "user-api",
    })
);

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "User Service is running"
    });
});

app.use("/api/v1", v1Router);

app.use(errorHandler);

export default app;