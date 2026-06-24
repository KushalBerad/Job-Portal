import React from "react";
import { useSelector } from "react-redux";
import { Briefcase } from "lucide-react";
import LatestJobCards from "./LatestJobCards";

const LatestJobs = () => {
    const allJobs = useSelector(
        (store) => store.job?.allJobs ?? []
    );

    const latestJobs = allJobs.slice(0, 6);

    return (
        <section className="max-w-7xl mx-auto my-20 px-4 sm:px-6 lg:px-8">
            {/* Latest jobs section heading */}
            <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                    <span className="text-[#6A38C2]">
                        Latest & Top
                    </span>{" "}
                    Job Openings
                </h2>

                <p className="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400">
                    Discover recently launched openings from top companies.
                </p>
            </div>

            {latestJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
                    <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-3">
                        <Briefcase className="h-6 w-6 text-slate-500" />
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        No Current Openings
                    </h3>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        No jobs are available right now.
                        Please check back later.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {latestJobs.map((job) => (
                        <LatestJobCards
                            key={job?._id}
                            job={job}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default LatestJobs;

