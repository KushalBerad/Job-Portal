import React from "react";
import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";

const AppliedJobTable = () => {
    const { allAppliedJobs = [] } =
        useSelector(
            (store) => store.job
        );

    const getStatusClass = (
        status
    ) => {
        switch (status) {
            case "rejected":
                return "bg-red-500";

            case "accepted":
                return "bg-green-500";

            default:
                return "bg-amber-500";
        }
    };

    return (
        <div
            className="
            overflow-x-auto
            rounded-xl
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            shadow-sm
        "
        >
            <Table>
                <TableCaption className="pb-4 text-slate-500 dark:text-slate-400">
                    Your applied jobs
                </TableCaption>

                <TableHeader className="bg-slate-50 dark:bg-slate-800">
                    <TableRow>
                        <TableHead>
                            Date
                        </TableHead>

                        <TableHead>
                            Role
                        </TableHead>

                        <TableHead>
                            Company
                        </TableHead>

                        <TableHead className="text-right">
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {allAppliedJobs.length ===
                    0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={4}
                                className="
                                py-10
                                text-center
                                text-slate-500
                                dark:text-slate-400
                            "
                            >
                                No jobs applied
                                yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        allAppliedJobs.map(
                            (
                                appliedJob
                            ) => {
                                const formattedDate =
                                    appliedJob?.createdAt
                                        ? new Date(
                                              appliedJob.createdAt
                                          ).toLocaleDateString(
                                              "en-IN"
                                          )
                                        : "N/A";

                                const status =
                                    appliedJob?.status ||
                                    "pending";

                                return (
                                    <TableRow
                                        key={
                                            appliedJob?._id
                                        }
                                        className="
                                        hover:bg-slate-50
                                        dark:hover:bg-slate-800/50
                                    "
                                    >
                                        <TableCell>
                                            {
                                                formattedDate
                                            }
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            {appliedJob
                                                ?.job
                                                ?.title ||
                                                "N/A"}
                                        </TableCell>

                                        <TableCell>
                                            {appliedJob
                                                ?.job
                                                ?.company
                                                ?.name ||
                                                "N/A"}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Badge
                                                className={`
                                                text-white
                                                uppercase
                                                ${getStatusClass(
                                                    status
                                                )}
                                            `}
                                            >
                                                {
                                                    status
                                                }
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            }
                        )
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default AppliedJobTable;