import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    MapPin,
} from "lucide-react";

import { Badge } from "../ui/badge";
import { formatSalary } from "@/utils/formatSalary";

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const handleNavigation = () => {
        if (job?._id) {
            navigate(`/description/${job._id}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            handleNavigation();
        }
    };

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={handleNavigation}
            onKeyDown={handleKeyDown}
            className="
        group
        w-full
        cursor-pointer
        rounded-2xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-purple-300
        hover:shadow-xl
        focus:outline-none
        focus:ring-2
        focus:ring-purple-500
      "
        >
            {/* Company details */}
            <div className="flex items-start justify-between">
                <div className="max-w-[85%]">
                    <h3 className="flex items-center gap-2 truncate text-base font-semibold text-slate-800 dark:text-slate-200">
                        <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                        <span className="truncate">
                            {job?.company?.name ||
                                "Unknown Company"}
                        </span>
                    </h3>

                    <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {job?.location ||
                            "Location not specified"}
                    </p>
                </div>
            </div>

            {/* Job content */}
            <div className="my-5 min-h-[90px]">
                <h2 className="line-clamp-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {job?.title ||
                        "Untitled Position"}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {job?.description ||
                        "No description available."}
                </p>
            </div>

            {/* Job metadata */}
            <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    {job?.position || 1} Positions
                </Badge>

                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                    {job?.jobType ||
                        "Full-Time"}
                </Badge>

                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                    {formatSalary(job?.salary)}
                </Badge>
            </div>
        </article>
    );
};

export default memo(LatestJobCards);

