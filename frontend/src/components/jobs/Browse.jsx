import React, {
    useMemo,
} from "react";

import {
    useSearchParams,
} from "react-router-dom";

import {
    useSelector,
} from "react-redux";

import {
    Loader2,
    SearchX,
} from "lucide-react";

import Navbar from "../shared/Navbar";
import Job from "../jobs/Job";

import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
    useGetAllJobs();

    const [searchParams] =
        useSearchParams();

    const keyword =
        searchParams.get(
            "keyword"
        ) || "";

    const {
        allJobs = [],
        loading = false,
    } = useSelector(
        (store) => store.job
    );

    // Filter jobs locally
    const filteredJobs =
        useMemo(() => {
            if (!keyword.trim()) {
                return allJobs;
            }

            const search =
                keyword.toLowerCase();

            return allJobs.filter(
                (job) =>
                    job?.title
                        ?.toLowerCase()
                        .includes(search) ||
                    job?.description
                        ?.toLowerCase()
                        .includes(search) ||
                    job?.company?.name
                        ?.toLowerCase()
                        .includes(search) ||
                    job?.location
                        ?.toLowerCase()
                        .includes(search)
            );
        }, [
            allJobs,
            keyword,
        ]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />

            <main className="mx-auto my-10 max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Page heading */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                        Search Results (
                        {
                            filteredJobs.length
                        }
                        )
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Browse jobs that
                        match your search.
                    </p>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />

                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            Loading jobs...
                        </p>
                    </div>
                ) : filteredJobs.length ===
                    0 ? (
                    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center shadow-sm">
                        <div className="mb-4 rounded-full bg-slate-100 dark:bg-slate-800 p-4">
                            <SearchX className="h-8 w-8 text-slate-500" />
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            No Jobs Found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            No jobs match
                            your current
                            search criteria.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredJobs.map(
                            (job) => (
                                <Job
                                    key={job?._id}
                                    job={job}
                                />
                            )
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Browse;
