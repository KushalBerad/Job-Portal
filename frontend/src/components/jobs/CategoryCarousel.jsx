import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer",
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        if (!query?.trim()) return;

        dispatch(setSearchedQuery(query.trim()));
        navigate("/browse");
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto my-16 px-12">
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {categories.map((cat, index) => (
                        <CarouselItem
                            key={`${cat}-${index}`}
                            className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center"
                        >
                            <Button
                                variant="outline"
                                onClick={() => searchJobHandler(cat)}
                                className="
                    rounded-full
                    font-medium
                    whitespace-nowrap
                    shadow-sm
                    hover:bg-purple-50
                    hover:text-purple-600
                    hover:border-purple-200
                    transition-all
                    duration-200
                "
                            >
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;