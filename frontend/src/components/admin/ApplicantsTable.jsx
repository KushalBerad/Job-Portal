import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { setAllApplicants } from '@/redux/applicationSlice'; // Added to sync local Redux state updates
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            // Fixed: Changed from .post to .put to match our secured backend routing standards
            const res = await axios.put(
                `${APPLICATION_API_END_POINT}/status/${id}/update`, 
                { status },
                { withCredentials: true } // Configured locally within the request config options wrapper block
            );

            if (res.data.success) {
                toast.success(res.data.message);

                // 🚀 UI Win: Optimistically update the local Redux store state instantly
                if (applicants && applicants.applications) {
                    const updatedApplications = applicants.applications.map((app) => {
                        if (app._id === id) {
                            return { ...app, status: status.toLowerCase() };
                        }
                        return app;
                    });
                    
                    // Push the freshly modified object layout back down into the state processor core
                    dispatch(setAllApplicants({ ...applicants, applications: updatedApplications }));
                }
            }
        } catch (error) {
            console.error("Status update error:", error);
            const errMsg = error.response?.data?.message || "Failed to update candidate status.";
            toast.error(errMsg);
        }
    };

    return (
        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of recent job application profiles</TableCaption>
                <TableHeader className="bg-gray-50/70">
                    <TableRow>
                        <TableHead className="font-semibold text-gray-700">Full Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Email Address</TableHead>
                        <TableHead className="font-semibold text-gray-700">Contact Number</TableHead>
                        <TableHead className="font-semibold text-gray-700">Resume Attachment</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applied Date</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-right pr-6">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants?.applications?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500 font-medium">
                                No candidates have applied to this position yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        applicants?.applications?.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium text-gray-900">{item?.applicant?.fullname || "N/A"}</TableCell>
                                <TableCell className="text-gray-600">{item?.applicant?.email || "N/A"}</TableCell>
                                <TableCell className="text-gray-600">{item?.applicant?.phoneNumber || "N/A"}</TableCell>
                                <TableCell>
                                    {item?.applicant?.profile?.resume ? (
                                        <a 
                                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer group" 
                                            href={item.applicant.profile.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <FileText className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
                                            <span className="underline truncate max-w-[150px]">
                                                {item.applicant.profile.resumeOriginalName || "View Resume"}
                                            </span>
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">No Resume Attached</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                    {/* Fixed: Guarded string splitting to protect against missing timestamps */}
                                    {item?.applicant?.createdAt ? item.applicant.createdAt.split("T")[0] : "N/A"}
                                </TableCell>
                                {/* Fixed: Replaced 'float-right' with standard 'text-right' tab mechanics */}
                                <TableCell className="text-right pr-6">
                                    <div className="inline-flex items-center justify-end gap-3">
                                        {/* Optional Visual Anchor Status indicator for quick tracking */}
                                        {item.status && item.status !== 'pending' && (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                                item.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        )}
                                        
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
                                                    <MoreHorizontal className="text-gray-500 w-5 h-5" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-36 p-1.5" align="end">
                                                {shortlistingStatus.map((status) => (
                                                    <div 
                                                        onClick={() => statusHandler(status, item?._id)} 
                                                        key={status} 
                                                        className='flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-gray-100 cursor-pointer text-gray-700 font-medium transition-colors my-0.5'
                                                    >
                                                        {status === "Accepted" ? (
                                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-600" />
                                                        )}
                                                        <span>{status}</span>
                                                    </div>
                                                ))}
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
