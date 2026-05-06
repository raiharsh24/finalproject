import React from "react";

import {
  NavLink,
} from "react-router-dom";

import {
  LayoutDashboard,
  BookOpen,
  Layers,
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  FileText,
  Trophy,
  Code2,
} from "lucide-react";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    to: "/library",
    label: "Library",
    icon: BookOpen,
  },

  {
    to: "/quiz-management",
    label: "Quiz Management",
    icon: Layers,
  },

  {
    to: "/problems-bank",
    label: "Problems Bank",
    icon: FileText,
  },

  {
    to: "/homeworks",
    label: "Weekly Contests",
    icon: ClipboardList,
  },

  {
    to: "/leaderboard",
    label: "Leaderboard",
    icon: Trophy,
  },

  {
    to: "/schedule",
    label: "Schedule",
    icon: Calendar,
  },

  {
    to: "/messages",
    label: "Messages",
    icon: MessageSquare,
  },

  {
    to: "/settings",
    label: "Settings",
    icon: SettingsIcon,
  },
];

export default function Sidebar() {

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "role"
      );

      window.location.href =
        "/";
    };

  return (
    <aside
      className="
        w-72
        h-screen
        bg-[#0f172a]
        text-white
        flex
        flex-col
        justify-between
        border-r
        border-slate-800
        shadow-2xl
      "
    >

      {/* TOP */}

      <div>

        {/* LOGO */}

        <div
          className="
            flex items-center gap-4
            px-7 py-7
            border-b border-slate-800
          "
        >

          <div
            className="
              w-12 h-12
              rounded-2xl
              bg-gradient-to-br
              from-violet-600
              to-indigo-600
              flex items-center justify-center
              shadow-lg shadow-violet-500/20
            "
          >

            <Code2 className="w-6 h-6 text-white" />

          </div>

          <div>

            <h1 className="text-xl font-bold tracking-wide text-white">

              CodeArena

            </h1>

            <p className="text-xs text-slate-400 mt-1">

              Teacher Dashboard

            </p>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="mt-6 px-4 space-y-2">

          {navItems.map(
            ({
              to,
              label,
              icon: Icon,
            }) => (
              <NavLink
                key={to}
                to={to}
                className={({
                  isActive,
                }) =>
                  `
                  group
                  relative
                  flex items-center gap-4
                  px-5 py-3.5
                  rounded-2xl
                  transition-all duration-300
                  
                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-violet-600
                        to-indigo-600
                        text-white
                        shadow-lg
                        shadow-violet-500/20
                      `
                      : `
                        text-slate-300
                        hover:bg-slate-800
                        hover:text-white
                      `
                  }
                `
                }
              >

                <Icon
                  className="
                    w-5 h-5
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                />

                <span className="font-medium text-sm tracking-wide">

                  {label}

                </span>

              </NavLink>
            )
          )}

        </nav>

      </div>

      {/* BOTTOM */}

      <div
        className="
          p-4
          border-t border-slate-800
          space-y-2
        "
      >

        <button
          className="
            w-full
            flex items-center gap-4
            px-5 py-3.5
            rounded-2xl
            text-slate-300
            hover:bg-slate-800
            hover:text-white
            transition-all duration-300
          "
        >

          <HelpCircle className="w-5 h-5" />

          <span className="font-medium text-sm">

            Help Center

          </span>

        </button>

        <button
          onClick={
            handleLogout
          }
          className="
            w-full
            flex items-center gap-4
            px-5 py-3.5
            rounded-2xl
            text-red-300
            hover:bg-red-500/10
            hover:text-red-200
            transition-all duration-300
          "
        >

          <LogOut className="w-5 h-5" />

          <span className="font-medium text-sm">

            Log Out

          </span>

        </button>

      </div>

    </aside>
  );
}