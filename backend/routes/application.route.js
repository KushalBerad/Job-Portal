import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";

const router = express.Router();

// Fixed: Changed from .get to .post to correctly align with database writes
router.route("/apply/:id").post(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);

// Fixed: Cleaned up path semantic standard mapping to use RESTful PUT or PATCH for updates
router.route("/status/:id/update").put(isAuthenticated, updateStatus);

export default router;
