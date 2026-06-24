import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        // 🚀 Optimization Win: Create an AbortController instance to cancel pending race-condition threads instantly
        const abortController = new AbortController();

        const fetchAllJobs = async () => {
            try {
                // Ensure we handle empty queries gracefully before hitting the API endpoint
                const queryParam = searchedQuery ? `?keyword=${encodeURIComponent(searchedQuery.trim())}` : "";
                
                const res = await axios.get(`${JOB_API_END_POINT}/get${queryParam}`, {
                    withCredentials: true,
                    signal: abortController.signal // Link the abort token directly to the Axios request pipeline
                });
                
                if (res.data?.success) {
                    dispatch(setAllJobs(res.data.jobs || []));
                }
            } catch (error) {
                // Ignore errors triggered intentionally by our AbortController request cancel execution
                if (axios.isCancel(error)) return;

                console.error("Error inside useGetAllJobs hook:", error);
            }
        };

        fetchAllJobs();

        // Cleanup: Terminate old data streams instantly if the search query changes before the previous one finished loading
        return () => {
            abortController.abort();
        };
    }, [searchedQuery, dispatch]); // 🔥 FIXED: Adding dependencies guarantees live, reactive search updates
};

export default useGetAllJobs;
