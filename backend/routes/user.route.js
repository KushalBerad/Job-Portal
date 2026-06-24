import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(singleUpload("file"), register);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.route("/profile/update").put(isAuthenticated, singleUpload("resume"), updateProfile);

export default router;
