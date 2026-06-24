import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, User2, Building2, Briefcase, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { setSingleCompany, setAllCompanies } from "@/redux/companySlice";
import { setAllAdminJobs } from "@/redux/jobSlice";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const { user = null } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;

    if (darkMode) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const userInitial = user?.fullname?.charAt(0)?.toUpperCase() || "U";

  const logoutHandler = async () => {
    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/logout`,
        {},
        { withCredentials: true },
      );

      if (res.data?.success) {
        dispatch(setUser(null));
        dispatch(setSingleCompany(null));
        dispatch(setAllCompanies([]));
        dispatch(setAllAdminJobs([]));

        toast.success(res.data.message || "Logged out successfully");

        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      {" "}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </Link>

        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <nav>
            <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              {user?.role === "recruiter" ? (
                <>
                  <li>
                    <Link
                      to="/admin/companies"
                      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                    >
                      <Building2 className="h-4 w-4" />
                      Companies
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/admin/jobs"
                      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                    >
                      <Briefcase className="h-4 w-4" />
                      Jobs
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/"
                      className="hover:text-purple-600 transition-colors"
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/jobs"
                      className="hover:text-purple-600 transition-colors"
                    >
                      Jobs
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/browse"
                      className="hover:text-purple-600 transition-colors"
                    >
                      Browse
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {!user ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>

              <Button
                onClick={() => navigate("/signup")}
                className="bg-[#6A38C2] hover:bg-[#5b30a6]"
              >
                Signup
              </Button>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer border border-slate-300 dark:border-slate-700">
                  <AvatarImage src={user?.profile?.profilePhoto} />
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-200">
                    {userInitial}
                  </div>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                className="w-80 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
                    <Avatar>
                      <AvatarImage src={user?.profile?.profilePhoto} />
                    </Avatar>

                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {user?.fullname}
                      </h4>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user?.profile?.bio || "No bio added"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {user?.role !== "recruiter" && (
                      <Button
                        variant="ghost"
                        onClick={() => navigate("/profile")}
                        className="w-full justify-start"
                      >
                        <User2 className="mr-2 h-4 w-4" />
                        View Profile
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      onClick={logoutHandler}
                      className="w-full justify-start text-red-600 hover:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
