import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// Fixed: Invoked singleUpload("file") as a function execution to prevent runtime engine crashes
router.route("/register").post(singleUpload("file"), register);
router.route("/login").post(login);

// Fixed: Swapped to a standard POST request for logout to prevent browser link pre-fetching traps
router.route("/logout").post(logout);

router.route("/profile/update").put(isAuthenticated, singleUpload("resume"), updateProfile);

export default router;
