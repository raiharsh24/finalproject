import { useEffect, useState } from "react";

import {
  Code,
  Trophy,
  FileCode2,
  BarChart3,
  Clock3,
  Flame,
  Target,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { motion } from "framer-motion";

export default function StudentDashboard({
  onNavigate,
}) {

  const [role,
    setRole] =
    useState("student");

  useEffect(() => {

    const storedRole =
      localStorage.getItem("role");

    if (storedRole) {
      setRole(storedRole);
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    window.location.reload();
  };

  const quickStats = [
    {
      title: "Problems Solved",
      value: "148",
      icon: <Code size={22} />,
      color:
        "from-violet-600 to-indigo-600",
    },

    {
      title: "Contest Rank",
      value: "#12",
      icon: <Trophy size={22} />,
      color:
        "from-pink-500 to-rose-500",
    },

    {
      title: "Submissions",
      value: "326",
      icon: <FileCode2 size={22} />,
      color:
        "from-cyan-500 to-blue-500",
    },

    {
      title: "Accuracy",
      value: "91%",
      icon: <Target size={22} />,
      color:
        "from-emerald-500 to-green-500",
    },
  ];

  return (

    <div className="flex h-screen bg-[#0b1120] text-white overflow-hidden">

      {/* SIDEBAR */}

      <aside className="hidden md:flex w-72 flex-col bg-gradient-to-b from-[#0f172a] to-[#111827] border-r border-white/10">

        <div className="p-6">

          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
            CodeArena.AI
          </h1>

        </div>

        <nav className="flex-1 px-4 space-y-2">

          <SidebarButton
            icon={<BarChart3 size={20} />}
            label="Dashboard"
            active
          />

          <SidebarButton
            icon={<Code size={20} />}
            label="Practice Arena"
            onClick={() =>
              onNavigate({
                view: "editor",
                problem: "Two Sum",
              })
            }
          />

          <SidebarButton
            icon={<FileCode2 size={20} />}
            label="My Submissions"
            onClick={() =>
              onNavigate({
                view: "submissions",
              })
            }
          />

          <SidebarButton
            icon={<Trophy size={20} />}
            label="Leaderboard"
            onClick={() =>
              onNavigate({
                view: "leaderboard",
                problem: "Two Sum",
              })
            }
          />

          <SidebarButton
            icon={<Clock3 size={20} />}
            label="Contest"
            onClick={() =>
              onNavigate({
                view: "contest",
              })
            }
          />

        </nav>

        {/* BOTTOM */}

        <div className="p-5 space-y-4">

          {/* STREAK */}

          <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-5 shadow-2xl">

            <div className="flex items-center gap-2">

              <Flame className="text-orange-300" />

              <span className="font-semibold">
                Current Streak
              </span>

            </div>

            <h2 className="text-3xl font-bold mt-3">
              5 Days
            </h2>

            <button className="mt-4 w-full bg-white text-violet-700 py-2 rounded-xl font-semibold">
              Continue
            </button>

          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 py-4 rounded-2xl transition-all"
          >

            <LogOut size={20} />

            <span className="font-semibold">
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}

        <header className="h-20 bg-[#111827]/95 border-b border-white/10 flex items-center justify-between px-8">

          <div>

            <h2 className="text-2xl font-bold">

              Welcome back,

              <span className="text-violet-400 ml-2 capitalize">
                {role}
              </span>

            </h2>

            <p className="text-gray-400 text-sm mt-1">
              Ready to solve more problems today?
            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-white/10">
              XP: 1240
            </div>

            <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-white/10">
              Rank #12
            </div>

            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold">
              H
            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main className="flex-1 overflow-y-auto p-8">

          {/* HERO */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            className="rounded-[32px] overflow-hidden bg-gradient-to-r from-violet-700 via-indigo-700 to-fuchsia-700 p-8 shadow-2xl"
          >

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

              <div>

                <p className="uppercase tracking-widest text-violet-200 text-sm">
                  STUDENT DASHBOARD
                </p>

                <h1 className="text-5xl font-black mt-3 leading-tight">
                  Master Coding
                  <br />
                  Like a Pro 🚀
                </h1>

                <p className="text-violet-100 mt-5 max-w-2xl text-lg">
                  Practice real interview problems, participate in contests,
                  and track your coding journey with live analytics.
                </p>

                <div className="flex gap-4 mt-8">

                  <button
                    onClick={() =>
                      onNavigate({
                        view: "editor",
                        problem: "Two Sum",
                      })
                    }
                    className="bg-white text-violet-700 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
                  >
                    Start Solving
                  </button>

                  <button
                    onClick={() =>
                      onNavigate({
                        view: "contest",
                      })
                    }
                    className="border border-white/30 px-6 py-3 rounded-2xl font-semibold hover:bg-white/10 transition"
                  >
                    Join Contest
                  </button>

                </div>

              </div>

              <div className="flex flex-col gap-4">

                <div className="bg-white/10 backdrop-blur-xl p-5 rounded-3xl border border-white/10">

                  <p className="text-sm text-violet-100">
                    Daily Progress
                  </p>

                  <h2 className="text-4xl font-black mt-2">
                    78%
                  </h2>

                  <div className="w-64 h-3 bg-white/20 rounded-full mt-4 overflow-hidden">

                    <div className="h-full w-[78%] bg-white rounded-full" />

                  </div>

                </div>

              </div>

            </div>

          </motion.div>

          {/* STATS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

            {quickStats.map((item, index) => (

              <motion.div
                key={index}

                initial={{
                  opacity: 0,
                  y: 15,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: index * 0.08,
                }}

                className={`bg-gradient-to-r ${item.color} rounded-3xl p-6 shadow-xl`}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-white/80">
                      {item.title}
                    </p>

                    <h2 className="text-4xl font-black mt-3">
                      {item.value}
                    </h2>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                    {item.icon}
                  </div>

                </div>

              </motion.div>

            ))}

          </div>

          {/* QUICK ACTIONS */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

            <QuickActionCard
              title="Practice Problems"
              desc="Solve curated coding challenges with live execution."
              button="Open Arena"

              onClick={() =>
                onNavigate({
                  view: "editor",
                  problem: "Two Sum",
                })
              }
            />

            <QuickActionCard
              title="View Submissions"
              desc="Track all previous attempts and coding scores."
              button="Open History"

              onClick={() =>
                onNavigate({
                  view: "submissions",
                })
              }
            />

            <QuickActionCard
              title="Leaderboard"
              desc="Compare your ranking with top coders."
              button="View Rankings"

              onClick={() =>
                onNavigate({
                  view: "leaderboard",
                  problem: "Two Sum",
                })
              }
            />

          </div>

        </main>

      </div>

    </div>
  );
}

/* ================= SIDEBAR BUTTON ================= */

function SidebarButton({
  icon,
  label,
  onClick,
  active,
}) {

  return (

    <button
      onClick={onClick}

      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
        active
          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg"
          : "hover:bg-white/10"
      }`}
    >

      <div className="flex items-center gap-3">

        {icon}

        <span className="font-medium">
          {label}
        </span>

      </div>

      <ChevronRight size={18} />

    </button>
  );
}

/* ================= QUICK CARD ================= */

function QuickActionCard({
  title,
  desc,
  button,
  onClick,
}) {

  return (

    <motion.div
      whileHover={{
        y: -5,
      }}

      className="bg-[#111827] border border-white/10 rounded-[28px] p-6 shadow-xl"
    >

      <h3 className="text-2xl font-bold">
        {title}
      </h3>

      <p className="text-gray-400 mt-3 leading-relaxed">
        {desc}
      </p>

      <button
        onClick={onClick}

        className="mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
      >
        {button}
      </button>

    </motion.div>
  );
}