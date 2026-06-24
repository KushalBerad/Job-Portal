import { setSingleCompany } from '@/redux/companySlice'; // 🔥 FIXED: Removed unused setAllJobs import safely
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();

    useEffect(() => {
        // Guard against execution if companyId is missing or undefined
        if (!companyId) return;

        // 🚀 Optimization: Create an AbortController instance to kill pending requests if the user navigates away early
        const abortController = new AbortController();

        const fetchSingleCompany = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
                    withCredentials: true,
                    signal: abortController.signal // Link the abort controller token directly to axios
                });
                
                if (res.data?.success) {
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                // Ignore errors triggered intentionally by our AbortController request cancel execution
                if (axios.isCancel(error)) return;

                console.error("Error inside useGetCompanyById hook:", error);
            }
        };

        fetchSingleCompany();

        // 🔥 FIXED: Cleanup unmount routine wipes out old stale data to prevent visual UI flashing
        return () => {
            abortController.abort(); // Cancel the active network request instantly
            dispatch(setSingleCompany(null)); // Reset store back to null so the next screen loads pristine fields
        };
    }, [companyId, dispatch]); 
};

export default useGetCompanyById;
