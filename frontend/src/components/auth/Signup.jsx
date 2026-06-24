import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading } from "@/redux/authSlice";

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, user } =
        useSelector(
            (store) => store.auth
        );

    const [showPassword, setShowPassword] =
        useState(false);

    const [input, setInput] =
        useState({
            fullname: "",
            email: "",
            phoneNumber: "",
            password: "",
            role: "",
            file: null,
        });

    const changeHandler = (e) => {
        const { name, value } =
            e.target;

        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const roleChangeHandler = (
        value
    ) => {
        setInput((prev) => ({
            ...prev,
            role: value,
        }));
    };

    const fileChangeHandler = (
        e
    ) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const maxSize =
            2 * 1024 * 1024;

        if (
            !allowedTypes.includes(
                file.type
            )
        ) {
            return toast.error(
                "Only JPG, PNG or WEBP allowed."
            );
        }

        if (
            file.size >
            maxSize
        ) {
            return toast.error(
                "Image must be under 2MB."
            );
        }

        setInput((prev) => ({
            ...prev,
            file,
        }));
    };

    const submitHandler = async (
        e
    ) => {
        e.preventDefault();

        if (
            !input.fullname.trim()
        ) {
            return toast.error(
                "Full name required."
            );
        }

        if (
            !input.email.trim()
        ) {
            return toast.error(
                "Email required."
            );
        }

        if (
            input.password.length <
            6
        ) {
            return toast.error(
                "Password must be at least 6 characters."
            );
        }

        if (!input.role) {
            return toast.error(
                "Select account type."
            );
        }

        const formData =
            new FormData();

        formData.append(
            "fullname",
            input.fullname.trim()
        );

        formData.append(
            "email",
            input.email
                .toLowerCase()
                .trim()
        );

        formData.append(
            "phoneNumber",
            input.phoneNumber.trim()
        );

        formData.append(
            "password",
            input.password
        );

        formData.append(
            "role",
            input.role
        );

        if (input.file) {
            formData.append(
                "file",
                input.file
            );
        }

        try {
            dispatch(setLoading(true));

            const res =
                await axios.post(
                    `${USER_API_END_POINT}/register`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                        withCredentials: true,
                    }
                );

            if (
                res.data?.success
            ) {
                toast.success(
                    res.data.message ||
                        "Account created"
                );

                navigate(
                    "/login"
                );
            }
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message ||
                    "Signup failed"
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (!user) return;

        navigate("/");
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />

            <div className="mx-auto flex min-h-[85vh] max-w-7xl items-center justify-center px-4">
                <form
                    onSubmit={
                        submitHandler
                    }
                    className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm"
                >
                    <div className="mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <UserPlus className="h-5 w-5 text-slate-700 dark:text-slate-300" />

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Signup
                        </h1>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <Label>
                                Full Name
                            </Label>
                            <Input
                                name="fullname"
                                value={
                                    input.fullname
                                }
                                onChange={
                                    changeHandler
                                }
                            />
                        </div>

                        <div>
                            <Label>
                                Email
                            </Label>
                            <Input
                                type="email"
                                name="email"
                                value={
                                    input.email
                                }
                                onChange={
                                    changeHandler
                                }
                            />
                        </div>

                        <div>
                            <Label>
                                Phone
                            </Label>
                            <Input
                                name="phoneNumber"
                                value={
                                    input.phoneNumber
                                }
                                onChange={
                                    changeHandler
                                }
                            />
                        </div>

                        <div>
                            <Label>
                                Password
                            </Label>

                            <div className="relative">
                                <Input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        input.password
                                    }
                                    onChange={
                                        changeHandler
                                    }
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Label>
                                Account Type
                            </Label>

                            <RadioGroup
                                value={
                                    input.role
                                }
                                onValueChange={
                                    roleChangeHandler
                                }
                                className="mt-2 flex gap-5"
                            >
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value="student"
                                        id="student"
                                    />
                                    <Label htmlFor="student">
                                        Student
                                    </Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <RadioGroupItem
                                        value="recruiter"
                                        id="recruiter"
                                    />
                                    <Label htmlFor="recruiter">
                                        Recruiter
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div>
                            <Label>
                                Profile Photo
                            </Label>

                            <Input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={
                                    fileChangeHandler
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={
                                loading
                            }
                            className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </div>

                    <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                        Already have an
                        account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-purple-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
