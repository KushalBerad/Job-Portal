import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { Loader2, AlertCircle } from 'lucide-react'; // Added icons for loading and error states

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // Select application state from your global Redux slice
    const { applicants } = useSelector(store => store.application);

    // Local component state to track network communication phases
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create an AbortController instance to cancel pending network threads if the user leaves the page early
        const abortController = new AbortController();

        const fetchAllApplicants = async () => {
            if (!params.id) return;
            
            try {
                setLoading(true);
                setError(null);

                const res = await axios.get(
                    `${APPLICATION_API_END_POINT}/${params.id}/applicants`, 
                    { 
                        withCredentials: true,
                        signal: abortController.signal // Link network call tracking token
                    }
                );

                if (res.data?.success) {
                    // Sync backend payload down to the global state layout engine
                    dispatch(setAllApplicants(res.data.job));
                }
            } catch (err) {
                // Ignore errors triggered intentionally by our AbortController request cancel execution
                if (axios.isCancel(err)) return;

                console.error("Error fetching applicants dashboard:", err);
                
                // Route unauthenticated expired sessions back to login screen cleanly
                if (err.response?.status === 401) {
                    setError("Session expired. Redirecting to login...");
                    setTimeout(() => navigate("/login"), 2000);
                } else {
                    setError(err.response?.data?.message || "Failed to load applicant records. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAllApplicants();

        // Cleanup: Terminate background data connection streams instantly if component demounts
        return () => {
            abortController.abort();
            dispatch(setAllApplicants(null)); // Clear old data out of store to avoid flashing old state to next page
        };
    }, [params.id, dispatch, navigate]); // Fixed: Added vital tracking context parameters here

    // Safe length calculation extracted into a fallback constant variable
    const totalApplicants = applicants?.applications?.length || 0;
    const jobTitle = applicants?.title || "Role";

    return (
        <div className="min-h-screen bg-gray-50/50">
            <Navbar />
            <div className='max-w-7xl mx-auto my-10 px-4'>
                {/* 1. Loading Feedback State Layer */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-gray-500 font-medium">Loading applicant information profiles...</p>
                    </div>
                ) : error ? (
                    /* 2. Error Fallback State Layer */
                    <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg max-w-2xl mx-auto my-10">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="font-medium text-sm">{error}</p>
                    </div>
                ) : (
                    /* 3. Operational Data State Layout Presentation Screen */
                    <>
                        <div className="mb-6">
                            <h1 className='font-bold text-2xl text-gray-900 tracking-tight'>
                                Applicants ({totalApplicants})
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">
                                Managing candidates for row position posting: <span className="font-semibold text-gray-700">{jobTitle}</span>
                            </p>
                        </div>
                        
                        {/* Render inner grid matrix tables map details */}
                        <ApplicantsTable />
                    </>
                )}
            </div>
        </div>
    );
};

export default Applicants;
