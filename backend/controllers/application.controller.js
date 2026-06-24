import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

export const applyJob = async (req, res, next) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Job ID format.",
                success: false
            });
        }

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        await Application.create({
            job: jobId,
            applicant: userId,
        });

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error in applyJob:", error);

        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAppliedJobs = async (req, res, next) => {
    try {
        const userId = req.id;
        
        // MongoDB returns an empty array [] if no records match, not null/undefined
        const applications = await Application.find({ applicant: userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                populate: { path: 'company' } // Removed redundant sorting options inside populate
            });

        if (!applications || applications.length === 0) {
            return res.status(404).json({ message: "No applications found.", success: false });
        }

        return res.status(200).json({
            applications, // Kept plural for cleaner code syntax
            success: true
        });
    } catch (error) {
        console.error("Error in getAppliedJobs:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getApplicants = async (req, res, next) => {
    try {
        const jobId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ message: "Invalid Job ID format.", success: false });
        }

        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: { path: 'applicant' }
        });

        if (!job) {
            return res.status(404).json({ message: 'Job not found.', success: false });
        }

        return res.status(200).json({
            job, 
            success: true // Fixed the "succees" typo here
        });
    } catch (error) {
        console.error("Error in getApplicants:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: 'Status is required', success: false });
        }

        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ message: "Invalid Application ID format.", success: false });
        }

        // Optimized: findByIdAndUpdate avoids loading the whole document state memory if not needed
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status: status.toLowerCase() },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        return res.status(200).json({
            message: "Status updated successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error in updateStatus:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};
