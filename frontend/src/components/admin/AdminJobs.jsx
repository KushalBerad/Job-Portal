import React, {
    useEffect,
    useState,
} from "react";

import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import AdminJobsTable from "./AdminJobsTable";

import useGetAllAdminJobs from "@/hooks/useGetAllAdminJobs";

import { setSearchJobByText } from "@/redux/jobSlice";

const AdminJobs = () => {
    useGetAllAdminJobs();

    const [input, setInput] =
        useState("");

    const navigate =
        useNavigate();

    const dispatch =
        useDispatch();

    useEffect(() => {
        const timer =
            setTimeout(() => {
                dispatch(
                    setSearchJobByText(
                        input.trim()
                    )
                );
            }, 300);

        return () =>
            clearTimeout(timer);
    }, [input, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(
                setSearchJobByText("")
            );
        };
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Input
                        placeholder="Search jobs..."
                        value={input}
                        onChange={(e) =>
                            setInput(
                                e.target.value
                            )
                        }
                        className="max-w-md bg-white dark:bg-slate-900"
                    />

                    <Button
                        onClick={() =>
                            navigate(
                                "/admin/jobs/create"
                            )
                        }
                    >
                        New Job
                    </Button>
                </div>

                <AdminJobsTable />
            </div>
        </div>
    );
};

export default AdminJobs;