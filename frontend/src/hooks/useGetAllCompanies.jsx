import { setAllCompanies } from '@/redux/companySlice'; // 🔥 FIXED: Imported matching slice action name
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // 🚀 Optimization Win: Create an AbortController instance to kill pending requests if the user navigates away early
        const abortController = new AbortController();

        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                    withCredentials: true,
                    signal: abortController.signal // Link the abort controller token directly to axios
                });
                
                if (res.data?.success) {
                    // 🔥 FIXED: Dispatched to the correct global Redux slice action name
                    dispatch(setAllCompanies(res.data.companies || []));
                }
            } catch (error) {
                // Ignore errors triggered intentionally by our AbortController request cancel execution
                if (axios.isCancel(error)) return;

                console.error("Error inside useGetAllCompanies hook:", error);
            }
        };

        fetchCompanies();

        // Cleanup: Terminate background connection streams instantly if the component unmounts
        return () => {
            abortController.abort();
        };
    }, [dispatch]); // 🔥 FIXED: Included dispatch in the dependency matrix to maintain React linter safety standards
};

export default useGetAllCompanies;
