import React from "react";

import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

import PageTitle from "./PageTitle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 flex items-center justify-between">

      {/* LEFT */}

      <div className="flex flex-col">

        <PageTitle />

        <p className="text-sm text-slate-500 mt-1">

          Manage contests, coding problems and students efficiently

        </p>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* SEARCH */}

        <div className="relative hidden lg:block">

          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search contests, quizzes, problems..."
            className="
              w-96
              bg-slate-100/80
              border border-slate-200
              rounded-2xl
              py-3
              pl-11
              pr-4
              text-sm
              text-slate-700
              outline-none
              transition-all duration-300
              focus:bg-white
              focus:border-violet-400
              focus:ring-4
              focus:ring-violet-100
            "
          />

        </div>

        {/* NOTIFICATIONS */}

        <button
          className="
            relative
            w-12 h-12
            rounded-2xl
            border border-slate-200
            bg-white
            hover:bg-slate-50
            transition-all duration-300
            hover:shadow-md
            flex items-center justify-center
          "
        >

          <Bell className="w-5 h-5 text-slate-700" />

          <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white"></span>

        </button>

        {/* PROFILE */}

        <div
          className="
            flex items-center gap-3
            pl-2
            pr-3
            py-2
            rounded-2xl
            hover:bg-slate-100
            transition-all duration-300
            cursor-pointer
          "
        >

          <div
            className="
              w-12 h-12
              rounded-2xl
              bg-gradient-to-br from-violet-600 to-indigo-600
              flex items-center justify-center
              text-white
              font-bold
              shadow-lg shadow-violet-500/20
            "
          >

            CA

          </div>

          <div className="hidden sm:flex flex-col leading-tight">

            <span className="text-sm font-semibold text-slate-800">

              CodeArena Admin

            </span>

            <span className="text-xs text-slate-500">

              Teacher Dashboard

            </span>

          </div>

          <ChevronDown className="w-4 h-4 text-slate-500" />

        </div>

      </div>

    </header>
  );
}