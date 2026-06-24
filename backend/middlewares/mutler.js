import multer from "multer";
import path from "path";

// 1. Configure memory allocation architecture
const storage = multer.memoryStorage();

// 2. Define strict validation rules
const MAX_FILE_SIZE = 5 * 1024 * 1024; // Strict 5MB size ceiling to protect RAM allocation
const ALLOWED_EXTENSIONS = /jpeg|jpg|png|pdf|docx|doc/;

// 3. Built-in file type filtering engine
const fileFilter = (req, file, cb) => {
    // Check both the file extension and the MIME type for validation spoofing defense
    const extname = ALLOWED_EXTENSIONS.test(path.extname(file.originalname).toLowerCase());
    const mimetype = ALLOWED_EXTENSIONS.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        // Return a clean error instead of breaking the execution thread
        return cb(new Error("Invalid file format. Only images (JPG, PNG) and documents (PDF, DOCX) are allowed."));
    }
};

// 4. Secure, production-hardened instance configuration
export const singleUpload = (fieldName = "file") => {
    return (req, res, next) => {
        const upload = multer({
            storage: storage,
            limits: { fileSize: MAX_FILE_SIZE },
            fileFilter: fileFilter
        }).single(fieldName); // Dynamic field configuration eliminates frontend naming dependencies

        // Intercept and handle errors locally within the middleware pipeline
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE") {
                    return res.status(400).json({
                        message: "File is too large. Maximum size allowed is 5MB.",
                        success: false
                    });
                }
                return res.status(400).json({ message: err.message, success: false });
            } else if (err) {
                // Captures custom file validation error thrown inside fileFilter
                return res.status(400).json({ message: err.message, success: false });
            }
            // If everything passes smoothly, transfer processing control to the next handler
            next();
        });
    };
};
