import React from "react";
import {
  Navigate,
} from "react-router-dom";

import {
  useSelector,
} from "react-redux";

import Navbar from "../shared/Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "../jobs/CategoryCarousel";
import LatestJobs from "../jobs/LatestJobs";
import Footer from "../shared/Footer";

import useGetAllJobs from "@/hooks/useGetAllJobs";

const Home = () => {
  useGetAllJobs();

  const { user } = useSelector(
    (store) => store.auth
  );

  // Redirect recruiters
  if (user?.role === "recruiter") {
    return (
      <Navigate
        to="/admin/companies"
        replace
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />
        <CategoryCarousel />
        <LatestJobs />
      </main>

      <Footer />
    </div>
  );
};

export default Home;

