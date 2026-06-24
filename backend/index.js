import dns from 'node:dns/promises';
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Forces Node to bypass slow DNS routing environments

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; // Added: Hardens HTTP headers
import compression from "compression"; // Added: Compresses JSON response payloads
import morgan from 'morgan';

import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// ==========================================
// 🛡️ SECURITY & OPTIMIZATION MIDDLEWARES
// ==========================================
app.use(helmet()); 
app.use(compression()); 
app.use(morgan('dev')); 

// Body Parsers with explicit size safety caps
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Dynamic CORS configuration mapping
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;

// ==========================================
// 🚀 API ROUTE ROUTING ENDPOINTS
// ==========================================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Catch-All 404 Route handler for broken URLs
app.use((req, res, next) => {
    return res.status(404).json({
        message: `Route path '${req.originalUrl}' not found on this server.`,
        success: false
    });
});

// ==========================================
// 🛑 GLOBAL CENTRALIZED ERROR MIDDLEWARE
// ==========================================
app.use((err, req, res, next) => {
    console.error("GLOBAL EXCEPTION CAPTURED 🚨:", err.stack);
    
    return res.status(err.status || 500).json({
        message: err.message || "An unexpected system internal error occurred.",
        success: false,
        // Hide structural stack frames from the frontend unless in local development
        error: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

// ==========================================
// 🔌 CONTROLLED BOOT SEQUENCE EXECUTION
// ==========================================
const startServer = async () => {
    try {
        // Force database synchronization BEFORE the network port opens
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Production server running on port: ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
        });
    } catch (error) {
        console.error("Fatal boot failure! Server could not initialize ❌:", error.message);
        process.exit(1);
    }
};

startServer();
