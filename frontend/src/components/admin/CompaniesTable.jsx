import React, { useMemo } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, MoreHorizontal, Building2 } from 'lucide-react'; // Added building fallback icon
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompaniesTable = () => {
    // 1. Safe extraction layout incorporating solid default empty arrays fallback targets
    const { companies = [], searchCompanyByText = "" } = useSelector(store => store.company);
    const navigate = useNavigate();

    // 🚀 Performance Win: Compute filtered arrays on the fly to eliminate double rendering
    const filteredCompanies = useMemo(() => {
        // Enforce safe array checking patterns before invoking filter loops
        if (!Array.isArray(companies)) return [];

        return companies.filter((company) => {
            if (!searchCompanyByText.trim()) return true;
            
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
    }, [companies, searchCompanyByText]);

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your recently registered companies</TableCaption>
                <TableHeader className="bg-gray-50/70">
                    <TableRow>
                        <TableHead className="w-[100px] font-semibold text-gray-700">Logo</TableHead>
                        <TableHead className="font-semibold text-gray-700">Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700 pr-6">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredCompanies.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-10 text-gray-500 font-medium">
                                No companies found matching your search.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredCompanies.map((company) => (
                            // Fixed: Configured a unique DOM row key identifier wrapper element
                            <TableRow key={company?._id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <Avatar className="h-9 w-9 border border-gray-100">
                                        {/* Added a clean, visual placeholder icon fallback if the logo image string is broken or absent */}
                                        <AvatarImage src={company?.logo} alt={`${company?.name || 'Company'} logo`} />
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                            <Building2 className="w-4 h-4" />
                                        </div>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium text-gray-900">
                                    {company?.name || "Unnamed Company"}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                    {/* Fixed: Guarded splitting sequence against null or uninitialized fields */}
                                    {company?.createdAt ? company.createdAt.split("T")[0] : "N/A"}
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
                                                <MoreHorizontal className="text-gray-500 w-5 h-5" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 p-1.5" align="end">
                                            <div 
                                                onClick={() => navigate(`/admin/companies/${company?._id}`)} 
                                                className='flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 cursor-pointer text-gray-700 font-medium transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4 text-gray-500' />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
