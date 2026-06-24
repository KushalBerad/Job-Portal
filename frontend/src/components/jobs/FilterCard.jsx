import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

import { setSearchedQuery } from "@/redux/jobSlice";

const filterData = [
    {
        title: "Location",
        options: [
            "Delhi NCR",
            "Bangalore",
            "Hyderabad",
            "Pune",
            "Mumbai",
        ],
    },
    {
        title: "Industry",
        options: [
            "Frontend Developer",
            "Backend Developer",
            "FullStack Developer",
        ],
    },
];

const FilterCard = () => {
    const dispatch =
        useDispatch();

    const [selectedValue, setSelectedValue] =
        useState("");

    const handleChange = (
        value
    ) => {
        setSelectedValue(
            value
        );

        dispatch(
            setSearchedQuery(
                value
            )
        );
    };

    const clearFilters =
        () => {
            setSelectedValue(
                ""
            );

            dispatch(
                setSearchedQuery(
                    ""
                )
            );
        };

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Filters
                </h2>

                {selectedValue && (
                    <button
                        onClick={
                            clearFilters
                        }
                        className="text-sm font-medium text-violet-600 hover:text-violet-700"
                    >
                        Clear
                    </button>
                )}
            </div>

            <RadioGroup
                value={
                    selectedValue
                }
                onValueChange={
                    handleChange
                }
                className="mt-5 space-y-5"
            >
                {filterData.map(
                    (
                        group
                    ) => (
                        <div
                            key={
                                group.title
                            }
                        >
                            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                                {
                                    group.title
                                }
                            </h3>

                            <div className="space-y-2">
                                {group.options.map(
                                    (
                                        option
                                    ) => {
                                        const id =
                                            `${group.title}-${option}`;

                                        return (
                                            <div
                                                key={
                                                    id
                                                }
                                                className="flex items-center gap-3"
                                            >
                                                <RadioGroupItem
                                                    id={
                                                        id
                                                    }
                                                    value={
                                                        option
                                                    }
                                                />

                                                <Label
                                                    htmlFor={
                                                        id
                                                    }
                                                    className="cursor-pointer text-sm text-slate-600 dark:text-slate-300"
                                                >
                                                    {
                                                        option
                                                    }
                                                </Label>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    )
                )}
            </RadioGroup>
        </div>
    );
};

export default FilterCard;
