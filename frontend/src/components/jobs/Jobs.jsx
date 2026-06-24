import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { SearchX } from "lucide-react";

import Navbar from "../shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "../jobs/Job";

const Jobs = () => {
    const {
        allJobs = [],
        searchedQuery = "",
    } = useSelector(
        (store) => store.job
    );

    const filteredJobs =
        useMemo(() => {
            if (
                !Array.isArray(
                    allJobs
                )
            ) {
                return [];
            }

            const query =
                searchedQuery
                    ?.toLowerCase()
                    ?.trim();

            if (!query) {
                return allJobs;
            }

            return allJobs.filter(
                (job) =>
                    job?.title
                        ?.toLowerCase()
                        .includes(
                            query
                        ) ||
                    job?.description
                        ?.toLowerCase()
                        .includes(
                            query
                        ) ||
                    job?.location
                        ?.toLowerCase()
                        .includes(
                            query
                        ) ||
                    job?.company?.name
                        ?.toLowerCase()
                        .includes(
                            query
                        )
            );
        }, [
            allJobs,
            searchedQuery,
        ]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />

            <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <aside className="w-full lg:w-[280px] shrink-0">
                        <FilterCard />
                    </aside>

                    <main className="flex-1">
                        {filteredJobs.length ===
                        0 ? (
                            <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
                                <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-4">
                                    <SearchX className="h-8 w-8 text-slate-400" />
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    No Jobs Found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    Try changing
                                    your filters
                                    or search
                                    keywords.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {filteredJobs.map(
                                    (
                                        job
                                    ) => (
                                        <Job
                                            key={
                                                job?._id
                                            }
                                            job={
                                                job
                                            }
                                        />
                                    )
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
