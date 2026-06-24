import mongoose from "mongoose";

// COMPANY SCHEMA

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Company name is required."],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    website: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    logo: {
        type: String // URL to Cloudinary CDN asset
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Recruiter User ID reference is required."]
    }
}, { timestamps: true });

// Indexing for instant loading of a recruiter's dashboard
companySchema.index({ userId: 1 });


export const Company = mongoose.model("Company", companySchema);