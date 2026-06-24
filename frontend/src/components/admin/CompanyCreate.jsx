import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { Loader2 } from 'lucide-react'; // Added loading spinner icon

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Fixed: Initialized with an explicit empty string to avoid undefined bugs
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false); // Added network loading lock state

    const registerNewCompany = async () => {
        // Enforce strict local string content check before hitting the backend
        if (!companyName || !companyName.trim()) {
            return toast.error("Please enter a valid company name before continuing.");
        }

        try {
            setLoading(true); // Close the interaction gate immediately

            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`, 
                { companyName: companyName.trim() }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message || "Company registered successfully!");
                
                const companyId = res?.data?.company?._id;
                // Redirect user down into the profile details edit section workflow
                if (companyId) {
                    navigate(`/admin/companies/${companyId}`);
                } else {
                    navigate("/admin/companies");
                }
            }
        } catch (error) {
            console.error("Company registration failed:", error);
            // Fixed: Safely capture and display backend error messages to the user
            const feedbackMessage = error.response?.data?.message || "Failed to register company. Please try again.";
            toast.error(feedbackMessage);
        } finally {
            setLoading(false); // Re-open interaction tracking hooks
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30">
            <Navbar />
            <div className='max-w-4xl mx-auto my-10 px-4'>
                <div className='my-10'>
                    <h1 className='font-bold text-3xl text-gray-900 tracking-tight'>Create Your Company Profile</h1>
                    <p className='text-gray-500 mt-2 text-sm sm:text-base'>
                        What name would you like to give your company? Don't worry, you can always change this later from your dashboard settings.
                    </p>
                </div>

                <div className="space-y-2 max-w-xl">
                    <Label htmlFor="company-name-input" className="text-sm font-semibold text-gray-700">
                        Company Name
                    </Label>
                    <Input
                        id="company-name-input"
                        type="text"
                        className="bg-white shadow-sm"
                        placeholder="e.g., JobHunt, Microsoft, Google"
                        value={companyName} // Fixed: Enforces clean, controlled component state updates
                        disabled={loading} // Prevent typing modifications during pending network execution requests
                        onChange={(e) => setCompanyName(e.target.value)}
                    />
                </div>
                
                <div className='flex items-center gap-3 my-10 border-t pt-6'>
                    <Button 
                        variant="outline" 
                        onClick={() => navigate("/admin/companies")}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    {/* Fixed: Disabled state and spinner layout prevent multi-click data duplication */}
                    <Button 
                        onClick={registerNewCompany}
                        disabled={loading || !companyName.trim()}
                        className="min-w-[120px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                <span>Creating...</span>
                            </>
                        ) : (
                            <span>Continue</span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
