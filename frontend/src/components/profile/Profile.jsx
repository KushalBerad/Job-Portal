import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Mail, Phone, Pen, FileText, Briefcase } from "lucide-react";

import Navbar from "../shared/Navbar";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";

import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
    useGetAppliedJobs();

    const [open, setOpen] =
        useState(false);

    const { user = null } =
        useSelector(
            (store) =>
                store.auth
        );

    const skills =
        Array.isArray(
            user?.profile
                ?.skills
        )
            ? user.profile
                  .skills
            : [];

    const hasResume =
        Boolean(
            user?.profile
                ?.resume
        );

    const userInitial =
        user?.fullname
            ?.charAt(0)
            ?.toUpperCase() ||
        "U";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-10 transition-colors duration-300">
            <Navbar />

            <div className="mx-auto mt-6 max-w-4xl px-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="flex flex-col gap-5 border-b border-slate-200 dark:border-slate-700 pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                            <Avatar className="h-20 w-20 border border-slate-200 dark:border-slate-700">
                                <AvatarImage
                                    src={
                                        user
                                            ?.profile
                                            ?.profilePhoto
                                    }
                                />

                                <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 text-xl font-bold text-slate-700 dark:text-slate-200">
                                    {
                                        userInitial
                                    }
                                </div>
                            </Avatar>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {user?.fullname ||
                                        "Candidate"}
                                </h1>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {user
                                        ?.profile
                                        ?.bio ||
                                        "No bio added yet"}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setOpen(
                                    true
                                )
                            }
                            className="rounded-xl"
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="space-y-3 border-b border-slate-200 dark:border-slate-700 py-6 text-sm">
                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Mail className="h-4 w-4 text-slate-400" />
                            {user?.email ||
                                "N/A"}
                        </div>

                        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                            <Phone className="h-4 w-4 text-slate-400" />
                            {user?.phoneNumber ||
                                "N/A"}
                        </div>
                    </div>

                    <div className="border-b border-slate-200 dark:border-slate-700 py-6">
                        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                            Skills
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            {skills.length >
                            0 ? (
                                skills.map(
                                    (
                                        skill
                                    ) => (
                                        <Badge
                                            key={
                                                skill
                                            }
                                            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        >
                                            {
                                                skill
                                            }
                                        </Badge>
                                    )
                                )
                            ) : (
                                <p className="text-sm italic text-slate-400">
                                    No skills
                                    added
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6">
                        <Label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                            Resume
                        </Label>

                        {hasResume ? (
                            <a
                                href={
                                    user
                                        ?.profile
                                        ?.resume
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                            >
                                <FileText className="h-4 w-4" />

                                {user
                                    ?.profile
                                    ?.resumeOriginalName ||
                                    "View Resume"}
                            </a>
                        ) : (
                            <p className="text-sm italic text-slate-400">
                                No resume uploaded
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <div className="mb-5 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-300" />

                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Applied Jobs
                        </h2>
                    </div>

                    <AppliedJobTable />
                </div>
            </div>

            <UpdateProfileDialog
                open={open}
                setOpen={setOpen}
            />
        </div>
    );
};

export default Profile;
