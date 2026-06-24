import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Safe extraction check (Ensures cookie parser middleware is configured)
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. Please log in.",
                success: false,
            });
        }

        // 2.key mismatch & handled synchronous execution safely
        // Wrap in a try-catch pattern or let the outer catch block intercept JWT library errors
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decode || !decode.userId) {
            return res.status(401).json({
                message: "Invalid or corrupted token session.",
                success: false
            });
        }

        // 3. Inject decrypted state securely into the request pipeline
        req.id = decode.userId;
        
        // Always execute next() to pass control down to the next route controller handler
        return next();

    } catch (error) {
        console.error("Authentication Middleware Error:", error.message);

        // 4. Handle specific JWT token library errors cleanly to prevent UI hangs
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Session expired. Please log in again.",
                success: false
            });
        }
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token authentication failed.",
                success: false
            });
        }

        // Catch-all response handler fallback for unexpected edge case failures
        return res.status(500).json({
            message: "Internal server authentication error.",
            success: false
        });
    }
};

export default isAuthenticated;
