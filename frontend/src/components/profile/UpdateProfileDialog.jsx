import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";

import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";

const UpdateProfileDialog = ({
    open,
    setOpen,
}) => {
    const dispatch =
        useDispatch();

    const { user } =
        useSelector(
            (store) =>
                store.auth
        );

    const [loading, setLoading] =
        useState(false);

    const [input, setInput] =
        useState({
            fullname: "",
            email: "",
            phoneNumber: "",
            bio: "",
            skills: "",
            file: null,
        });

    useEffect(() => {
        if (!user) return;

        setInput({
            fullname:
                user?.fullname ||
                "",

            email:
                user?.email ||
                "",

            phoneNumber:
                user?.phoneNumber ||
                "",

            bio:
                user?.profile
                    ?.bio || "",

            skills:
                user?.profile?.skills?.join(
                    ", "
                ) || "",

            file: null,
        });
    }, [user, open]);

    const inputChangeHandler =
        (e) => {
            const {
                name,
                value,
            } = e.target;

            setInput(
                (
                    prev
                ) => ({
                    ...prev,
                    [name]:
                        value,
                })
            );
        };

    const fileChangeHandler =
        (e) => {
            const file =
                e.target
                    ?.files?.[0];

            if (!file)
                return;

            const maxSize =
                2 *
                1024 *
                1024;

            if (
                file.type !==
                "application/pdf"
            ) {
                toast.error(
                    "Only PDF resumes are allowed"
                );

                return;
            }

            if (
                file.size >
                maxSize
            ) {
                toast.error(
                    "Resume must be under 2MB"
                );

                return;
            }

            setInput(
                (
                    prev
                ) => ({
                    ...prev,
                    file,
                })
            );
        };

    const submitHandler =
        async (e) => {
            e.preventDefault();

            if (
                !input.fullname.trim()
            ) {
                return toast.error(
                    "Full name is required"
                );
            }

            if (
                !input.email.trim()
            ) {
                return toast.error(
                    "Email is required"
                );
            }

            const cleanedSkills =
                input.skills
                    .split(
                        ","
                    )
                    .map(
                        (
                            skill
                        ) =>
                            skill.trim()
                    )
                    .filter(
                        Boolean
                    );

            const formData =
                new FormData();

            formData.append(
                "fullname",
                input.fullname.trim()
            );

            formData.append(
                "email",
                input.email
                    .trim()
                    .toLowerCase()
            );

            formData.append(
                "phoneNumber",
                input.phoneNumber.trim()
            );

            formData.append(
                "bio",
                input.bio.trim()
            );

            formData.append(
                "skills",
                cleanedSkills.join(
                    ","
                )
            );

            // IMPORTANT:
            // Backend expects "resume"
            if (
                input.file
            ) {
                formData.append(
                    "resume",
                    input.file
                );
            }

            try {
                setLoading(
                    true
                );

                const res =
                    await axios.put(
                        `${USER_API_END_POINT}/profile/update`,
                        formData,
                        {
                            headers:
                                {
                                    "Content-Type":
                                        "multipart/form-data",
                                },
                            withCredentials: true,
                        }
                    );

                if (
                    res.data
                        ?.success
                ) {
                    dispatch(
                        setUser(
                            res.data
                                .user
                        )
                    );

                    toast.success(
                        res.data
                            .message ||
                            "Profile updated successfully"
                    );

                    setOpen(
                        false
                    );
                }
            } catch (error) {
                toast.error(
                    error
                        ?.response
                        ?.data
                        ?.message ||
                        "Failed to update profile"
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <Dialog
            open={open}
            onOpenChange={
                setOpen
            }
        >
            <DialogContent className="sm:max-w-[500px] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                        Update Profile
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={
                        submitHandler
                    }
                    className="space-y-5"
                >
                    <div className="space-y-4">
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
                                    inputChangeHandler
                                }
                                placeholder="Enter full name"
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
                                    inputChangeHandler
                                }
                                placeholder="Enter email"
                            />
                        </div>

                        <div>
                            <Label>
                                Phone Number
                            </Label>

                            <Input
                                name="phoneNumber"
                                value={
                                    input.phoneNumber
                                }
                                onChange={
                                    inputChangeHandler
                                }
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <Label>
                                Bio
                            </Label>

                            <Input
                                name="bio"
                                value={
                                    input.bio
                                }
                                onChange={
                                    inputChangeHandler
                                }
                                placeholder="Tell recruiters about yourself"
                            />
                        </div>

                        <div>
                            <Label>
                                Skills
                            </Label>

                            <Input
                                name="skills"
                                value={
                                    input.skills
                                }
                                onChange={
                                    inputChangeHandler
                                }
                                placeholder="React, Node.js, MongoDB"
                            />
                        </div>

                        <div>
                            <Label>
                                Resume
                            </Label>

                            <div className="mt-2 flex items-center gap-3">
                                <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={
                                        fileChangeHandler
                                    }
                                    className="cursor-pointer"
                                />

                                <Upload className="h-5 w-5 text-slate-400" />
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                                PDF only • Max
                                2MB
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
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
                                    Updating...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
