import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // 🚀 Optimization Win: Create an AbortController instance to kill pending request threads if the user navigates away early
        const abortController = new AbortController();

        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    withCredentials: true,
                    signal: abortController.signal // Link the abort controller token directly to axios
                });
                
                if (res.data?.success) {
                    // Sync the backend payload down to the global state layout engine cleanly
                    dispatch(setAllAdminJobs(res.data.jobs || []));
                }
            } catch (error) {
                // Ignore errors triggered intentionally by our AbortController request cancel execution
                if (axios.isCancel(error)) return;

                console.error("Error inside useGetAllAdminJobs hook:", error);
            }
        };

        fetchAllAdminJobs();

        // Cleanup: Terminate background connection streams instantly if the component unmounts
        return () => {
            abortController.abort();
        };
    }, [dispatch]); // 🔥 FIXED: Included dispatch in the dependency matrix to maintain React linter safety standards
};

export default useGetAllAdminJobs;
