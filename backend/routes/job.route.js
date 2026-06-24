import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    postJob,
    getAllJobs,
    getJobById,
    getAdminJobs
} from "../controllers/job.controller.js";

const router = express.Router();

// Recruiter only
router.route("/post").post(isAuthenticated, postJob);

// Public routes
router.route("/get").get(getAllJobs);
router.route("/get/:id").get(getJobById);

// Protected recruiter route
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);

export default router;