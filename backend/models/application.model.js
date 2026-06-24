import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, "Job reference is required."]
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Applicant reference is required."]
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid application status.'
        },
        default: 'pending',
        trim: true,
        lowercase: true // Automatically converts "Accepted" to "accepted" before saving
    }
}, { timestamps: true });

// 1. Foolproof protection against race-condition duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// 2. High-performance index for fetching a user's dashboard (getAppliedJobs)
applicationSchema.index({ applicant: 1, createdAt: -1 });

// 3. High-performance index for fetching an admin's dashboard (getApplicants)
applicationSchema.index({ job: 1, createdAt: -1 });


export const Application = mongoose.model("Application", applicationSchema);
