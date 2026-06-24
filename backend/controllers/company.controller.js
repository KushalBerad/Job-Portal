import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName || !companyName.trim()) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        // Case-insensitive exact match to prevent duplicates like "Nitor" and "nitor"
        const existingCompany = await Company.findOne({ 
            name: { $regex: new RegExp(`^${companyName.trim()}$`, 'i') } 
        });

        if (existingCompany) {
            return res.status(400).json({
                message: "A company with this name is already registered.",
                success: false
            });
        }

        const company = await Company.create({
            name: companyName.trim(),
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.error("Error in registerCompany:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({ userId });

        // Fixed check: Verify if array has elements
        if (!companies || companies.length === 0) {
            return res.status(404).json({
                message: "No companies found for this user.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.error("Error in getCompany:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Company ID format.", success: false });
        }

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        console.error("Error in getCompanyById:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const { name, description, website, location } = req.body;

        // 1. Fail early if the MongoDB ID format is malformed
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: "Invalid Company ID format.", success: false });
        }

        // 2. Setup safe, fallback base for fields data update
        const updateData = { name, description, website, location };

        // 3. Conditional File Handling to completely eliminate runtime crashes
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            updateData.logo = cloudResponse.secure_url; // Inject only if uploaded
        }

        // 4. Update operational document state database entry
        const company = await Company.findByIdAndUpdate(companyId, updateData, { 
            new: true, 
            runValidators: true 
        });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            company, // Best practice to return updated record state to frontend
            success: true
        });

    } catch (error) {
        console.error("Error in updateCompany:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};
