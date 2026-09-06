import express from "express";

import v1Router from "./api/v1/index.js";

const app = express();

app.use(express.json());


// Health check
app.get("/health", (_req, res) => {

    res.status(200).json({
        success: true,
        message: "Order Service is running"
    });

});


// API
app.use(
    "/api/v1",
    v1Router
);

export default app;