import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import { USER_API_END_POINT } from "@/utils/constant";
import { setLoading, setUser } from "@/redux/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, user } = useSelector(
        (store) => store.auth
    );

    const [showPassword, setShowPassword] =
        useState(false);

    const [input, setInput] =
        useState({
            email: "",
            password: "",
            role: "",
        });

    const changeHandler = (e) => {
        const { name, value } = e.target;

        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const roleChangeHandler = (value) => {
        setInput((prev) => ({
            ...prev,
            role: value,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.email.trim()) {
            return toast.error(
                "Email is required."
            );
        }

        if (!input.password.trim()) {
            return toast.error(
                "Password is required."
            );
        }

        if (!input.role) {
            return toast.error(
                "Please select account type."
            );
        }

        try {
            dispatch(setLoading(true));

            const res = await axios.post(
                `${USER_API_END_POINT}/login`,
                {
                    email: input.email
                        .toLowerCase()
                        .trim(),

                    password:
                        input.password,

                    role: input.role,
                },
                {
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data?.success) {
                dispatch(
                    setUser(
                        res.data.user
                    )
                );

                toast.success(
                    res.data.message ||
                        "Login successful"
                );

                navigate(
                    res.data.user
                        ?.role ===
                        "recruiter"
                        ? "/admin/companies"
                        : "/"
                );
            }
        } catch (error) {
            toast.error(
                error?.response?.data
                    ?.message ||
                    "Invalid credentials"
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (!user) return;

        navigate(
            user.role ===
                "recruiter"
                ? "/admin/companies"
                : "/"
        );
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Navbar />

            <div className="mx-auto flex min-h-[85vh] max-w-7xl items-center justify-center px-4">
                <form
                    onSubmit={submitHandler}
                    className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm"
                >
                    <div className="mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-4">
                        <LogIn className="h-5 w-5 text-slate-700 dark:text-slate-300" />

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Login
                        </h1>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <Label>Email</Label>

                            <Input
                                type="email"
                                name="email"
                                value={
                                    input.email
                                }
                                onChange={
                                    changeHandler
                                }
                                placeholder="name@example.com"
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
                                    placeholder="Enter password"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>

                    <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
                        Don’t have an
                        account?{" "}
                        <Link
                            to="/signup"
                            className="font-medium text-purple-600 hover:underline"
                        >
                            Signup
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
