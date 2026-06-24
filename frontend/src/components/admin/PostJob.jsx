import React, {
    useState,
} from "react";

import Navbar from "../shared/Navbar";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

import {
    useNavigate,
} from "react-router-dom";

import {
    useSelector,
} from "react-redux";

import axios from "axios";

import {
    JOB_API_END_POINT,
} from "@/utils/constant";

import {
    Loader2,
    Briefcase,
} from "lucide-react";

import { toast } from "sonner";

const PostJob = () => {
    const navigate =
        useNavigate();

    const {
        companies = [],
    } = useSelector(
        (store) =>
            store.company
    );

    const [loading, setLoading] =
        useState(false);

    const [input, setInput] =
        useState({
            title: "",
            description: "",
            requirements: "",
            salary: "",
            location: "",
            jobType: "",
            experience: "",
            position: "",
            companyId: "",
        });

    const changeHandler = (
        e
    ) => {
        setInput({
            ...input,
            [e.target.name]:
                e.target.value,
        });
    };

    const submitHandler =
        async (e) => {
            e.preventDefault();

            if (
                !input.companyId
            ) {
                return toast.error(
                    "Select a company"
                );
            }

            try {
                setLoading(true);

                const res =
                    await axios.post(
                        `${JOB_API_END_POINT}/post`,
                        {
                            title:
                                input.title,
                            description:
                                input.description,
                            requirements:
                                input.requirements,
                            salary:
                                input.salary,
                            location:
                                input.location,
                            jobType:
                                input.jobType,
                            experience:
                                input.experience,
                            position:
                                input.position,
                            companyId:
                                input.companyId,
                        },
                        {
                            headers:
                                {
                                    "Content-Type":
                                        "application/json",
                                },
                            withCredentials: true,
                        }
                    );

                if (
                    res.data
                        ?.success
                ) {
                    toast.success(
                        res.data
                            .message
                    );

                    navigate(
                        "/admin/jobs"
                    );
                }
            } catch (
                error
            ) {
                toast.error(
                    error.response
                        ?.data
                        ?.message ||
                        "Failed to post job"
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <div className="mx-auto max-w-4xl px-4 py-8">
                <form
                    onSubmit={
                        submitHandler
                    }
                    className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm"
                >
                    <div className="mb-8 flex items-center gap-3">
                        <Briefcase className="h-6 w-6" />
                        <h1 className="text-2xl font-bold">
                            Post Job
                        </h1>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            "title",
                            "description",
                            "requirements",
                            "salary",
                            "location",
                            "jobType",
                            "experience",
                            "position",
                        ].map(
                            (
                                field
                            ) => (
                                <div
                                    key={
                                        field
                                    }
                                >
                                    <Label className="mb-2 block capitalize">
                                        {
                                            field
                                        }
                                    </Label>

                                    <Input
                                        name={
                                            field
                                        }
                                        value={
                                            input[
                                                field
                                            ]
                                        }
                                        onChange={
                                            changeHandler
                                        }
                                    />
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-5">
                        <Label className="mb-2 block">
                            Company
                        </Label>

                        <Select
                            value={
                                input.companyId
                            }
                            onValueChange={(
                                value
                            ) =>
                                setInput(
                                    {
                                        ...input,
                                        companyId:
                                            value,
                                    }
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select company" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    {companies.map(
                                        (
                                            company
                                        ) => (
                                            <SelectItem
                                                key={
                                                    company._id
                                                }
                                                value={
                                                    company._id
                                                }
                                            >
                                                {
                                                    company.name
                                                }
                                            </SelectItem>
                                        )
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        className="mt-6 w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Posting...
                            </>
                        ) : (
                            "Post Job"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;