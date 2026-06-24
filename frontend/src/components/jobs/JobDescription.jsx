import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    ArrowLeft,
    Loader2,
    Calendar,
    Briefcase,
    MapPin,
    Users,
} from "lucide-react";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import Navbar from "../shared/Navbar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

import {
    JOB_API_END_POINT,
    APPLICATION_API_END_POINT,
} from "@/utils/constant";

import { formatSalary } from "@/utils/formatSalary";
import { setSingleJob } from "@/redux/jobSlice";

const JobDescription = () => {
    // =====================================================
    // ROUTE PARAMS & NAVIGATION
    // =====================================================
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // =====================================================
    // REDUX STORE
    // =====================================================
    const { singleJob } = useSelector(
        (store) => store.job
    );

    const { user } = useSelector(
        (store) => store.auth
    );

    // =====================================================
    // LOCAL STATES
    // =====================================================
    const [loadingPage, setLoadingPage] =
        useState(true);

    const [submitLoading, setSubmitLoading] =
        useState(false);

    const [isApplied, setIsApplied] =
        useState(false);

    // =====================================================
    // FETCH SINGLE JOB
    // =====================================================
    useEffect(() => {
        const fetchJob = async () => {
            if (!jobId) return;

            try {
                setLoadingPage(true);

                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${jobId}`,
                    {
                        withCredentials: true,
                    }
                );

                if (res.data?.success) {
                    dispatch(
                        setSingleJob(res.data.job)
                    );
                }
            } catch (error) {
                toast.error(
                    "Failed to load job details"
                );
            } finally {
                setLoadingPage(false);
            }
        };

        fetchJob();
    }, [jobId, dispatch]);

    // =====================================================
    // CHECK IF USER ALREADY APPLIED
    // =====================================================
    useEffect(() => {
        if (!singleJob || !user) {
            setIsApplied(false);
            return;
        }

        const applications = Array.isArray(
            singleJob?.applications
        )
            ? singleJob.applications
            : [];

        const alreadyApplied =
            applications.some(
                (application) => {
                    const applicantId =
                        application?.applicant
                            ?._id ||
                        application?.applicant;

                    return (
                        applicantId ===
                        user?._id
                    );
                }
            );

        setIsApplied(alreadyApplied);
    }, [singleJob, user]);

    // =====================================================
    // APPLY JOB HANDLER
    // =====================================================
    const applyJobHandler = async () => {
        // User not logged in
        if (!user) {
            toast.error(
                "Please login to apply"
            );

            navigate("/login");
            return;
        }

        // Already applied
        if (isApplied) return;

        try {
            setSubmitLoading(true);

            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                {},
                {
                    withCredentials: true,
                }
            );

            if (res.data?.success) {
                setIsApplied(true);

                // Update local job state
                const updatedJob = {
                    ...singleJob,
                    applications: [
                        ...(singleJob?.applications ||
                            []),
                        {
                            applicant:
                                user._id,
                        },
                    ],
                };

                dispatch(
                    setSingleJob(updatedJob)
                );

                toast.success(
                    res.data.message ||
                        "Applied successfully"
                );
            }
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message ||
                    "Failed to apply"
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    // =====================================================
    // FORMATTED POST DATE
    // =====================================================
    const postedDate =
        singleJob?.createdAt
            ? new Date(
                  singleJob.createdAt
              ).toLocaleDateString(
                  "en-IN",
                  {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                  }
              )
            : "N/A";

    // =====================================================
    // LOADING STATE UI
    // =====================================================
    if (loadingPage) {
        return (
            <>
                <Navbar />

                <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading job details...
                    </p>
                </div>
            </>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================
    return (
        <>
            <Navbar />

            <div className="mx-auto my-10 max-w-4xl px-4 sm:px-6">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="mb-6 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                </Button>

                {/* Job Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
                    {/* Header */}
                    <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                                {singleJob?.title ||
                                    "Untitled Position"}
                            </h1>

                            {/* Job Badges */}
                            <div className="mt-3 flex flex-wrap gap-2">
                                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    {singleJob?.position ||
                                        1}{" "}
                                    Positions
                                </Badge>

                                <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                    {singleJob?.jobType ||
                                        "Full-Time"}
                                </Badge>

                                <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                                    {formatSalary(
                                        singleJob?.salary
                                    )}
                                </Badge>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <Button
                            onClick={
                                applyJobHandler
                            }
                            disabled={
                                isApplied ||
                                submitLoading
                            }
                            className={`min-w-[160px] rounded-xl font-semibold ${
                                isApplied
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                                    : "bg-[#6A38C2] hover:bg-[#5b30a6]"
                            }`}
                        >
                            {submitLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isApplied ? (
                                "Already Applied"
                            ) : (
                                "Apply Now"
                            )}
                        </Button>
                    </div>

                    {/* Specifications */}
                    <div className="mt-6">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Job Specifications
                        </h2>

                        <div className="grid gap-4 border-b border-slate-200 pb-6 text-sm dark:border-slate-700 sm:grid-cols-2">
                            {/* Role */}
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <Briefcase className="h-4 w-4 text-slate-400" />

                                <span>
                                    Role:
                                    <strong className="ml-2">
                                        {
                                            singleJob?.title
                                        }
                                    </strong>
                                </span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <MapPin className="h-4 w-4 text-slate-400" />

                                <span>
                                    Location:
                                    <strong className="ml-2">
                                        {singleJob?.location ||
                                            "Not specified"}
                                    </strong>
                                </span>
                            </div>

                            {/* Experience */}
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <Calendar className="h-4 w-4 text-slate-400" />

                                <span>
                                    Experience:
                                    <strong className="ml-2">
                                        {singleJob?.experienceLevel ||
                                            0}{" "}
                                        years
                                    </strong>
                                </span>
                            </div>

                            {/* Salary */}
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                ₹
                                <span>
                                    Salary:
                                    <strong className="ml-2">
                                        {formatSalary(
                                            singleJob?.salary
                                        )}
                                    </strong>
                                </span>
                            </div>

                            {/* Applicants */}
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <Users className="h-4 w-4 text-slate-400" />

                                <span>
                                    Applicants:
                                    <strong className="ml-2">
                                        {singleJob
                                            ?.applications
                                            ?.length ||
                                            0}
                                    </strong>
                                </span>
                            </div>

                            {/* Posted Date */}
                            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                <Calendar className="h-4 w-4 text-slate-400" />

                                <span>
                                    Posted:
                                    <strong className="ml-2">
                                        {
                                            postedDate
                                        }
                                    </strong>
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                                Job Description
                            </h3>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {singleJob?.description ||
                                        "No description provided."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobDescription;