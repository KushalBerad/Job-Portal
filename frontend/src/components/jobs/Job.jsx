import React, {memo,} from "react";
import {useNavigate,} from "react-router-dom";
import { motion } from "framer-motion";
import {Bookmark,MapPin,Calendar,Briefcase,} from "lucide-react";
import { Button } from "@/components/ui/button";
import {Avatar,AvatarImage,} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatSalary } from "@/utils/formatSalary";

const Job = ({ job }) => {
    const navigate =
        useNavigate();

    const createdDate =
        job?.createdAt
            ? new Date(
                job.createdAt
            )
            : null;

    const currentDate =
        new Date();

    const diffDays =
        createdDate
            ? Math.floor(
                (currentDate -
                    createdDate) /
                (1000 *
                    60 *
                    60 *
                    24)
            )
            : null;

    const daysAgoText =
        diffDays === null
            ? "N/A"
            : diffDays === 0
                ? "Today"
                : diffDays === 1
                    ? "Yesterday"
                    : `${diffDays} days ago`;

    const navigateToJob =
        () => {
            if (job?._id) {
                navigate(
                    `/description/${job._id}`
                );
            }
        };

    const handleKeyDown =
        (e) => {
            if (
                e.key ===
                "Enter" ||
                e.key === " "
            ) {
                navigateToJob();
            }
        };

    const handleBookmarkClick =
        (e) => {
            e.stopPropagation();
        };

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={
                navigateToJob
            }
            onKeyDown={
                handleKeyDown
            }
            // whileHover={{
            //     y: -4,
            // }}
            // whileTap={{
            //     scale: 0.99,
            // }}
            // transition={{
            //     duration: 0.2,
            // }}
            className="
        group
        flex
        h-full
        cursor-pointer
        flex-col
        justify-between
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
        hover:border-purple-300
        hover:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-purple-500
      "
        >
            {/* Top metadata */}
            <div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                            {daysAgoText}
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Bookmark job"
                        onClick={
                            handleBookmarkClick
                        }
                        className="rounded-full text-slate-500 hover:text-violet-600"
                    >
                        <Bookmark className="h-4 w-4" />
                    </Button>
                </div>

                {/* Company */}
                <div className="my-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <Avatar className="h-9 w-9 rounded-lg">
                            <AvatarImage
                                src={
                                    job?.company
                                        ?.logo
                                }
                                alt={`${job?.company?.name || "Company"} logo`}
                            />

                            <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-700">
                                <Briefcase className="h-4 w-4 text-slate-400" />
                            </div>
                        </Avatar>
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                            {job?.company
                                ?.name ||
                                "Unknown Company"}
                        </h2>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <MapPin className="h-3 w-3 shrink-0" />

                            <span>
                                {job?.location ||
                                    "Location not specified"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[90px]">
                    <h1 className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                        {job?.title ||
                            "Untitled Position"}
                    </h1>

                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {job?.description ||
                            "No description available."}
                    </p>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {job?.position ||
                            1}{" "}
                        Positions
                    </Badge>

                    <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        {job?.jobType ||
                            "Full-Time"}
                    </Badge>

                    <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                        {formatSalary(
                            job?.salary
                        )}
                    </Badge>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
                <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigateToJob();
                    }}
                >
                    Details
                </Button>

                <Button
                    className="flex-1 rounded-xl bg-[#7209b7] hover:bg-[#5b0794]"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >
                    Save Later
                </Button>
            </div>
        </article>
    );
};

export default memo(Job);
