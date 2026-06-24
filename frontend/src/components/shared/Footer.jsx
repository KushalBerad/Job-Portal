import React from "react";
import {
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const currentYear =
    new Date().getFullYear();

  return (
    <footer
      className="
        mt-auto
        border-t
        border-slate-200
        dark:border-slate-800
        bg-white
        dark:bg-slate-950
        py-8
        transition-colors
      "
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Job
            <span className="text-[#F83002]">
              Portal
            </span>
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {currentYear} JobPortal.
            All rights reserved.
          </p>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-5">
          <a
            href="#"
            aria-label="Facebook"
            className="text-slate-400 transition-colors hover:text-blue-600"
          >
            <Facebook className="h-5 w-5" />
          </a>

          <a
            href="#"
            aria-label="Twitter"
            className="text-slate-400 transition-colors hover:text-sky-500"
          >
            <Twitter className="h-5 w-5" />
          </a>

          <a
            href="#"
            aria-label="LinkedIn"
            className="text-slate-400 transition-colors hover:text-blue-700"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
