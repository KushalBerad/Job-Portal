import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const AdminJobsTable = () => { 
    const { allAdminJobs = [], searchJobByText = "" } = useSelector(store => store.job);
    const navigate = useNavigate();

    const filteredJobs = useMemo(() => {
        return allAdminJobs.filter((job) => {
            if (!searchJobByText.trim()) return true;

            const searchLower = searchJobByText.toLowerCase();
            const jobTitle = job?.title?.toLowerCase() || "";
            const companyName = job?.company?.name?.toLowerCase() || ""; 

            return jobTitle.includes(searchLower) || companyName.includes(searchLower);
        });
    }, [allAdminJobs, searchJobByText]);

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your recently posted jobs</TableCaption>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead className="font-semibold">Company Name</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="text-right font-semibold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                No matching jobs found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredJobs.map((job) => (
                            
                            <TableRow key={job._id || Math.random()} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900">
                                    {job?.company?.name || "N/A"}
                                </TableCell>
                                <TableCell className="text-gray-600">{job?.title || "Untitled Role"}</TableCell>
                                <TableCell className="text-gray-500">
                                    {job?.createdAt ? job.createdAt.split("T")[0] : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
                                                <MoreHorizontal className="text-gray-500 w-5 h-5" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-36 p-2" align="end">
                                            <div 
                                                onClick={() => navigate(`/admin/companies/${job._id}`)} 
                                                className='flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit</span>
                                            </div>
                                            <div 
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} 
                                                className='flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-gray-100 cursor-pointer text-gray-700 transition-colors mt-1'
                                            >
                                                <Eye className='w-4 h-4' />
                                                <span>Applicants</span>
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

export default AdminJobsTable;
