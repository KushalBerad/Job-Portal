import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
    const params = useParams();
    // Fetch individual company details into global state on mount
    useGetCompanyById(params.id);
    
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("name", input.name.trim());
        formData.append("description", input.description.trim());
        formData.append("website", input.website.trim());
        formData.append("location", input.location.trim());
        
        if (input.file) {
            // 🔥 FIXED: Changed key from "file" to "logo" to match backend Multer routing config
            formData.append("logo", input.file); 
        }

        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            
            if (res.data.success) {
                toast.success(res.data.message || "Company profiles updated!");
                navigate("/admin/companies");
            }
        } catch (error) {
            console.error("Company setup transmission failure:", error);
            const feedbackMsg = error.response?.data?.message || "Failed to update company information.";
            toast.error(feedbackMsg);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 FIXED: Safe optional chaining checks prevent application crashes while data loads
    useEffect(() => {
        if (singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null // Keep file selection clean unless a new file is uploaded
            });
        }
    }, [singleCompany]);

    return (
        <div className="min-h-screen bg-gray-50/30">
            <Navbar />
            <div className='max-w-xl mx-auto my-10 px-4 sm:px-6'>
                <form onSubmit={submitHandler} className="bg-white border rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
                    <div className='flex items-center gap-4 border-b pb-4'>
                        {/* 🔥 FIXED: Explicitly set type="button" to prevent back-click form submissions */}
                        <Button 
                            type="button" 
                            onClick={() => navigate("/admin/companies")} 
                            variant="ghost" 
                            className="flex items-center gap-1.5 text-gray-500 font-medium hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-2xl text-gray-900 tracking-tight'>Company Setup</h1>
                    </div>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="bg-white"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">Website URL</Label>
                            <Input
                                type="url"
                                name="website"
                                placeholder="https://example.com"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-gray-700">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                placeholder="Mumbai, Pune, etc."
                                value={input.location}
                                onChange={changeEventHandler}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                                <Upload className="w-4 h-4 text-gray-400" />
                                <span>Company Logo Asset</span>
                            </Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="cursor-pointer file:bg-gray-50 file:text-gray-700 file:font-medium bg-white"
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                        {loading ? (
                            <Button disabled className="w-full">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                <span>Uploading assets, please wait...</span>
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full font-semibold shadow-sm shadow-blue-500/10">
                                Save Structural Changes
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanySetup;
