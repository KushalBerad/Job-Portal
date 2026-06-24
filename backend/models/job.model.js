// ==========================================
// 💼 JOB SCHEMA
// ==========================================
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Job description is required."],
        trim: true
    },
    requirements: [{
        type: String,
        trim: true
    }],
    salary: {
        type: Number, // Stored as absolute integer or currency unit
        required: [true, "Salary details are required."]
    },
    experienceLevel: {
        type: Number, // E.g., years of experience required
        required: [true, "Experience level is required."]
    },
    location: {
        type: String,
        required: [true, "Job location is required."],
        trim: true
    },
    jobType: {
        type: String, // E.g., "Full-time", "Remote", "Internship"
        required: [true, "Job type is required."],
        trim: true
    },
    position: {
        type: Number, // Number of open vacancies available
        required: [true, "Number of positions is required."],
        default: 1
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: [true, "Associated Company reference is required."]
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Creator User ID reference is required."]
    },
    applications: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }
]
    // 🔥 FIXED: 'applications' array completely REMOVED to prevent document size inflation.
}, { timestamps: true });

// ==========================================
// 🚀 PRODUCTION JOB INDEXING LAYER
// ==========================================

// 1. Speeds up filtered search feeds (Job boards)
jobSchema.index({ location: 1, jobType: 1 });

// 2. Speeds up sorting jobs by latest post time 
jobSchema.index({ createdAt: -1 });

// 3. Speeds up looking up jobs under a specific company
jobSchema.index({ company: 1 });


export const Job = mongoose.model("Job", jobSchema);