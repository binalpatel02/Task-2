import express from "express";
import { passport, errorHandler } from "@library/shared";
import v1Router from "./api/v1/index.js";

const app = express();

app.use(express.json());

app.use(passport.initialize());

app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Product Service is running"
    });
});

app.use("/api/v1", v1Router);

app.use(errorHandler);

export default app;