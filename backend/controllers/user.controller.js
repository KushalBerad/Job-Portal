import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email.', success: false });
        }

        let profilePhotoUrl = ""; 
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname: fullname.trim(),
            email: normalizedEmail,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: { profilePhoto: profilePhotoUrl }
        });

        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ message: "Internal server error during registration", success: false });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ message: "Something is missing", success: false });
        }

        // Fixed: Use a new variable instead of reassigning a const variable
        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });
        
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect email or password.", success: false });
        }

        if (role !== user.role) {
            return res.status(400).json({ message: "Account doesn't exist with current role.", success: false });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        // Secure Cookie configuration options matching throughout the application environment
        const cookieOptions = {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production' // true only in production
        };

        return res.status(200)
            .cookie("token", token, cookieOptions)
            .json({
                message: `Welcome back ${userResponse.fullname}`,
                user: userResponse,
                success: true
            });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Internal server error during login.", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        // Fixed: Cookie clearing must pass matching flag configurations to clear completely
        return res.status(200)
            .cookie("token", "", { 
                maxAge: 0, 
                httpOnly: true, 
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            })
            .json({
                message: "Logged out successfully.",
                success: true
            });
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({ message: "Internal server error during logout.", success: false });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; 

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        // 1. Updating text fields safely
        if (fullname) user.fullname = fullname.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;

        // 2. Fixed Array sanitization logic (removes structural whitespace contamination)
        if (skills) {
            user.profile.skills = skills.split(",")
                .map(skill => skill.trim())
                .filter(skill => skill !== "");
        }

        // 3. Fixed File Processing Loop (Runs Cloudinary ONLY if file exists)
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                resource_type: "auto" // Essential flag to support PDF/DOCX resume file payloads safely
            });
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = req.file.originalname;
        }

        await user.save();

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: userResponse,
            success: true
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({ message: "Internal server error during profile update.", success: false });
    }
};
