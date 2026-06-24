import mongoose from "mongoose";
import { Job } from "../models/job.model.js";

/**
 * @route   POST /api/v1/job/post
 * @desc    Allows authenticated recruiters/admins to post a new job listing
 * @access  Private (Recruiter Only)
 */
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id; // Extracted via authentication middleware

        // 1. Request Payload Validation Guard
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        // 2. Document Creation Mapping
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","), // Converts comma-separated string to an Array
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error in postJob controller:", error);
        return res.status(500).json({
            message: "Internal server error while creating job.",
            success: false
        });
    }
};

/**
 * @route   GET /api/v1/job/get
 * @desc    Retrieves job listings with Server-Side Pagination and MongoDB Text Index Searching
 * @access  Private (Student/Authenticated Users)
 */
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        // 1. Server-Side Pagination Parameter Engineering
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12; // Capping dataset chunks to 12 rows per page
        const skip = (page - 1) * limit;

        // 2. Query Setup: Utilizing Native MongoDB Text Indexes ($text) over slow Regex loops
        const query = keyword ? { $text: { $search: keyword } } : {};

        // 3. Parallel Execution: Processing dataset fetch and count aggregates simultaneously (Fast Performance)
        const [jobs, totalJobs] = await Promise.all([
            Job.find(query)
                .populate({ path: "company" })
                .sort({ createdAt: -1 }) // Sort by latest listings
                .skip(skip)
                .limit(limit),
            Job.countDocuments(query)
        ]);

        // 4. Clean API Pagination Metadata Contract Distribution
        return res.status(200).json({
            jobs,
            pagination: {
                totalJobs,
                currentPage: page,
                totalPages: Math.ceil(totalJobs / limit),
                pageSize: jobs.length
            },
            success: true
        });
    } catch (error) {
        console.error("Error in getAllJobs controller:", error);
        return res.status(500).json({
            message: "Internal server error while fetching jobs.",
            success: false
        });
    }
};

/**
 * @route   GET /api/v1/job/:id
 * @desc    Retrieves details of a single job with strict ID validation formatting boundaries
 * @access  Private (Authenticated Users)
 */
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        // 1. Input Boundary Guard: Prevent Mongoose Cast Crashes on malformed/invalid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Job ID format.",
                success: false
            });
        }

        // 2. Execute Lookup and Populate Associated Applications arrays
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Error in getJobById controller:", error);
        return res.status(500).json({
            message: "Internal server error while retrieving job details.",
            success: false
        });
    }
};

/**
 * @route   GET /api/v1/job/getadminjobs
 * @desc    Retrieves all job records provisioned by a specific authenticated admin account
 * @access  Private (Admin Only)
 */
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;

        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            options: { sort: { createdAt: -1 } }
        });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No admin jobs found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error in getAdminJobs controller:", error);
        return res.status(500).json({
            message: "Internal server error while retrieving admin jobs.",
            success: false
        });
    }
};
