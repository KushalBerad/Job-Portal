import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { Plus } from 'lucide-react'; // Added icon for visual reinforcement

const Companies = () => {
    // 1. Fetch all companies automatically using your custom hook logic
    useGetAllCompanies();
    
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // 2. High-Performance Filter Debounce Engine
    useEffect(() => {
        // Postpone updating the global Redux store until the user stops typing for 300ms
        const delayDebounceFn = setTimeout(() => {
            dispatch(setSearchCompanyByText(input));
        }, 300);

        // Cleanup: Clear the timeout if the user presses another key within the 300ms window
        return () => clearTimeout(delayDebounceFn);
    }, [input, dispatch]);

    // 3. Complete Component Unmount State Reset Gate
    useEffect(() => {
        // Clean up the global search filter when the user leaves the page
        return () => {
            dispatch(setSearchCompanyByText(""));
        };
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-gray-50/40">
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <div className='flex items-center justify-between my-5 gap-4'>
                    <Input
                        className="w-full sm:w-fit min-w-[300px] bg-white shadow-sm"
                        placeholder="Filter companies by name..."
                        value={input} // Fixed: Enforces a solid, controlled input component binding
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button 
                        onClick={() => navigate("/admin/companies/create")}
                        className="whitespace-nowrap flex items-center gap-1.5 shadow-sm"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Company</span>
                    </Button>
                </div>
                
                {/* The presentation table layer remains completely isolated from typing strains */}
                <CompaniesTable />
            </div>
        </div>
    );
};

export default Companies;
