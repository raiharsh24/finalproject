import React, {
  useEffect,
  useState,
} from "react";

import {
  Trophy,
  Medal,
  Flame,
  Crown,
} from "lucide-react";

const mockLeaderboard = [
  {
    id: 1,
    name: "Shivani Singh",
    score: 980,
    solved: 14,
    streak: 7,
  },

  {
    id: 2,
    name: "Harsh Rai",
    score: 920,
    solved: 13,
    streak: 5,
  },

  {
    id: 3,
    name: "Priya Singh",
    score: 870,
    solved: 11,
    streak: 6,
  },

  {
    id: 4,
    name: "Rohit Kumar",
    score: 830,
    solved: 10,
    streak: 4,
  },

  {
    id: 5,
    name: "Sneha Patel",
    score: 790,
    solved: 9,
    streak: 3,
  },
];

export default function Leaderboard() {
  const [leaders,
    setLeaders] =
    useState([]);

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "contest_leaderboard"
      );

    if (saved) {
      setLeaders(
        JSON.parse(saved)
      );
    } else {
      setLeaders(
        mockLeaderboard
      );

      localStorage.setItem(
        "contest_leaderboard",
        JSON.stringify(
          mockLeaderboard
        )
      );
    }
  }, []);

  return (
    <div className="space-y-8">

      {/* HERO */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 shadow-xl border border-slate-800">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#8b5cf6,_transparent_35%)]" />

        <div className="relative z-10 flex items-center gap-4">

          <div className="w-16 h-16 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg">

            <Trophy className="w-8 h-8 text-white" />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-white tracking-tight">
              Leaderboard
            </h1>

            <p className="text-slate-300 mt-2 text-lg">
              Top performers across contests and coding challenges
            </p>

          </div>

        </div>

      </div>

      {/* TOP 3 */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {leaders.slice(0, 3).map(
          (user, index) => (
            <div
              key={user.id}
              className={`relative overflow-hidden rounded-3xl p-7 shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
              
              ${
                index === 0
                  ? "bg-gradient-to-br from-slate-900 to-slate-800 border-yellow-500/20"
                  : index === 1
                  ? "bg-gradient-to-br from-slate-800 to-slate-700 border-slate-500/20"
                  : "bg-gradient-to-br from-stone-900 to-stone-800 border-orange-500/20"
              }
              
              text-white`}
            >

              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

              <div className="relative z-10">

                <div className="flex items-center justify-between">

                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">

                    {index === 0 ? (
                      <Crown className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Medal className="w-6 h-6 text-white" />
                    )}

                  </div>

                  <span className="text-3xl font-bold text-white/80">
                    #{index + 1}
                  </span>

                </div>

                <div className="mt-8">

                  <h2 className="text-3xl font-bold">
                    {user.name}
                  </h2>

                  <p className="text-slate-300 mt-1">
                    Elite Competitive Coder
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">

                    <p className="text-sm text-slate-400">
                      Score
                    </p>

                    <h3 className="text-2xl font-bold mt-1">
                      {user.score}
                    </h3>

                  </div>

                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">

                    <p className="text-sm text-slate-400">
                      Solved
                    </p>

                    <h3 className="text-2xl font-bold mt-1">
                      {user.solved}
                    </h3>

                  </div>

                </div>

                <div className="mt-6 flex items-center gap-2 text-orange-300">

                  <Flame className="w-5 h-5" />

                  <span className="font-medium">
                    {user.streak} day streak
                  </span>

                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Global Rankings
            </h2>

            <p className="text-slate-500 mt-1">
              Live rankings from coding contests
            </p>

          </div>

        </div>

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-500">
                Rank
              </th>

              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-500">
                Student
              </th>

              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-500">
                Score
              </th>

              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-500">
                Solved
              </th>

              <th className="px-8 py-4 text-left text-sm font-semibold text-slate-500">
                Streak
              </th>

            </tr>

          </thead>

          <tbody>

            {leaders.map(
              (user, index) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-all duration-200"
                >

                  <td className="px-8 py-6">

                    <div className="font-bold text-slate-700">
                      #{index + 1}
                    </div>

                  </td>

                  <td className="px-8 py-6">

                    <div className="flex items-center gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">

                        {user.name.charAt(0)}

                      </div>

                      <div>

                        <p className="font-semibold text-slate-900">
                          {user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          Competitive Programmer
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-8 py-6">

                    <span className="font-bold text-violet-600 text-lg">
                      {user.score}
                    </span>

                  </td>

                  <td className="px-8 py-6 text-slate-700 font-medium">

                    {user.solved}

                  </td>

                  <td className="px-8 py-6">

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 font-semibold text-sm">

                      <Flame className="w-4 h-4" />

                      {user.streak}

                    </div>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}