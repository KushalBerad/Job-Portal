import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // 🚀 Optimization: Create an AbortController instance to kill pending requests if the user navigates away early
        const abortController = new AbortController();

        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials: true,
                    signal: abortController.signal // Link the abort controller token directly to axios
                });
                
                // 🔥 FIXED: Mapped to 'res.data.applications' to match our production backend plurality standard
                if (res.data?.success) {
                    dispatch(setAllAppliedJobs(res.data.applications || []));
                }
            } catch (error) {
                // Ignore errors triggered intentionally by our AbortController request cancel execution
                if (axios.isCancel(error)) return;

                console.error("Error inside useGetAppliedJobs hook:", error);
            }
        };

        fetchAppliedJobs();

        // Cleanup: Terminate background connection streams instantly if the component unmounts
        return () => {
            abortController.abort();
        };
    }, [dispatch]); // 🔥 FIXED: Included dispatch in the dependency matrix to maintain React linter safety standards
};

export default useGetAppliedJobs;
