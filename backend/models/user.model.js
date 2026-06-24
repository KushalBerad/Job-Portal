import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Full name is required."],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email address is required."],
        unique: true,
        trim: true,
        lowercase: true // Automatically fixes casing differences to prevent login failures
    },
    phoneNumber: {
        type: String, // Changed from Number to String to support leading zeros and prefixes
        required: [true, "Phone number is required."],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    role: {
        type: String,
        enum: {
            values: ['student', 'recruiter'],
            message: '{VALUE} is not a valid user role.'
        },
        required: [true, "User role selection is required."]
    },
    profile: {
        bio: { type: String, trim: true },
        skills: [{ type: String, trim: true }], // Auto-trims individual parsed skill strings
        resume: { type: String }, // Secure URL path string pointing to Cloudinary PDF asset
        resumeOriginalName: { type: String, trim: true },
        company: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Company' 
        }, 
        profilePhoto: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true });

// USER INDEXING LAYER

// 1. Speeds up nested subdocument lookups for corporate dashboards
userSchema.index({ "profile.company": 1 }, { sparse: true }); // Sparse ensures null student fields skip compilation indexing files

// 2. High performance query optimization for parsing specific skills feed filters
userSchema.index({ "profile.skills": 1 });


export const User = mongoose.model('User', userSchema);
