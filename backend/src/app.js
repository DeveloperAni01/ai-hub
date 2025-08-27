/**
 * Express Application Configuration
 * AI Hub Backend API
 */

import express from "express";
import cookieParser from "cookie-parser";

/* Route Imports */
import userRouter from "./routes/user.routes.js";
import chatRouter from './routes/chat.routes.js';

// Initialize Express Application
const app = express();

/* ========================================
 * MIDDLEWARE CONFIGURATION
 * ======================================== */

/**
 * JSON Body Parser Middleware
 * Parses incoming requests with JSON payloads
 */
app.use(express.json());

/**
 * URL-Encoded Body Parser Middleware
 * Parses incoming requests with URL-encoded payloads (form data)
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Cookie Parser Middleware
 * Parses cookies attached to the client request object
 */
app.use(cookieParser());

/* ========================================
 * API ROUTES CONFIGURATION
 * ======================================== */

/**
 * Health Check Endpoint
 * GET /ai-hub/api/v1
 * Basic endpoint to verify API is running and accessible
 */
app.get("/ai-hub/api/v1", (req, res) => {
    res.status(200).json({
        success: true,
        message: "AI Hub API v1 is running successfully",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

/**
 * User Management Routes
 * Handles all user-related operations
 * @route /ai-hub/api/v1/user/*
 */
app.use("/ai-hub/api/v1/user", userRouter);

app.use("/ai-hub/api/v1/chat", chatRouter);

// Export the configured Express application
export default app;
