"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CarouselContext = React.createContext(null);

function Carousel({
    opts,
    orientation = "horizontal",
    setApi,
    className,
    children,
    ...props
}) {
    const [carouselRef, api] = useEmblaCarousel(opts);

    React.useEffect(() => {
        if (!api || !setApi) return;
        setApi(api);
    }, [api, setApi]);

    return (
        <CarouselContext.Provider value={{ api }}>
            <div
                ref={carouselRef}
                className={className}
                {...props}
            >
                {children}
            </div>
        </CarouselContext.Provider>
    );
}

function CarouselContent({ className, ...props }) {
    return (
        <div className="overflow-hidden">
            <div className={`flex ${className}`} {...props} />
        </div>
    );
}

function CarouselItem({ className, ...props }) {
    return (
        <div
            className={`min-w-0 shrink-0 grow-0 basis-full ${className}`}
            {...props}
        />
    );
}

function CarouselPrevious({ className }) {
    return (
        <button
            className={`absolute left-0 top-1/2 -translate-y-1/2 ${className}`}
        >
            <ChevronLeft />
        </button>
    );
}

function CarouselNext({ className }) {
    return (
        <button
            className={`absolute right-0 top-1/2 -translate-y-1/2 ${className}`}
        >
            <ChevronRight />
        </button>
    );
}

export {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
};