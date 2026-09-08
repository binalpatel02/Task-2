import express from "express";
import apiV1Router from "./api/v1/index.js";
import { passport, errorHandler } from "@library/shared";

const app = express();

app.use(express.json());

app.use(passport.initialize());

// Health check
app.get("/health", (_req, res) => {

    res.status(200).json({
        success: true,
        message: "Error Service is running"
    });

});

app.use("/api/v1", apiV1Router);

app.use(errorHandler);

export default app;