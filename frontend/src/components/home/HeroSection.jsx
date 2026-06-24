import React, { useState } from "react";
import { Search } from "lucide-react";
import {
    useDispatch,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import { Button } from  "@/components/ui/button";

import {
    setSearchedQuery,
} from "@/redux/jobSlice";

const HeroSection = () => {
    const [query, setQuery] =
        useState("");

    const dispatch =
        useDispatch();

    const navigate =
        useNavigate();

    const searchJobHandler = (
        e
    ) => {
        e.preventDefault();

        const sanitizedQuery =
            query.trim();

        if (
            !sanitizedQuery
        ) {
            return;
        }

        dispatch(
            setSearchedQuery(
                sanitizedQuery
            )
        );
        navigate("/browse");
    };

    return (
        <section className="px-4 pt-14 sm:pt-20 min-h-[80vh]">
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
                {/* Hero badge */}
                <span
                    className="
            mb-6
            rounded-full
            border
            border-red-200
            bg-red-50
            px-5
            py-2
            text-xs
            font-semibold
            tracking-wide
            text-[#F83002]
            dark:border-red-900/30
            dark:bg-red-950/40
            "
                >
                    No. 1 Job Hunt Platform
                </span>

                {/* Hero heading */}
                <h1
                    className="
            text-4xl
            font-extrabold
            tracking-tight
            text-slate-900
            dark:text-white
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            leading-tight
            "
                >
                    Search, Apply &
                    <br className="hidden sm:block" />
                    Get Your{" "}
                    <span className="text-[#6A38C2]">
                        Dream Jobs
                    </span>
                </h1>

                {/* Hero description */}
                <p
                    className="
            mt-5
            max-w-2xl
            text-sm
            leading-relaxed
            text-slate-500
            dark:text-slate-400
            sm:text-base
            md:text-lg
            "
                >
                    Discover thousands
                    of curated job
                    openings from top
                    companies and
                    accelerate your
                    career journey.
                </p>

                {/* Search form */}
                <form
                    onSubmit={
                        searchJobHandler
                    }
                    className="
            mt-8
            flex
            w-full
            max-w-2xl
            items-center
            overflow-hidden
            rounded-full
            border
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            shadow-md
            transition-all
            duration-300
            focus-within:ring-2
            focus-within:ring-[#6A38C2]
            "
                >
                    <label
                        htmlFor="job-search"
                        className="sr-only"
                    >
                        Search jobs
                    </label>

                    <input
                        id="job-search"
                        type="text"
                        value={query}
                        onChange={(e) =>
                            setQuery(
                                e.target.value
                            )
                        }
                        placeholder="Find your dream jobs..."
                        className="
                w-full
                bg-transparent
                px-5
                py-4
                text-sm
                text-slate-800
                outline-none
                placeholder:text-slate-400
                dark:text-slate-200
                sm:text-base
            "
                    />

                    <Button
                        type="submit"
                        aria-label="Search jobs"
                        className="
                h-full
                rounded-none
                rounded-r-full
                bg-[#6A38C2]
                px-6
                hover:bg-[#5b30a6]
            "
                    >
                        <Search className="h-5 w-5 text-white" />
                    </Button>
                </form>
            </div>
        </section>
    );
};

export default HeroSection;
