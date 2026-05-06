import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axios from "axios";

import StatCard from "../components/StatCard";

import {
  BarChart2,
  Code,
  BarChart,
  Trophy,
  ArrowRight,
} from "lucide-react";

import {
  recentActivities,
} from "../data/students";

import Button from "../components/Button";

export default function Dashboard() {
  const navigate =
    useNavigate();

  /* ================= STATES ================= */

  const [problemCount,
    setProblemCount] =
    useState(0);

  const [quizCount,
    setQuizCount] =
    useState(0);

  const [contestCount,
    setContestCount] =
    useState(0);

  const [topStudent,
    setTopStudent] =
    useState(null);

  const [recentQuizzes,
    setRecentQuizzes] =
    useState([]);

  /* ================= LOAD ================= */

  useEffect(() => {
    fetchProblemCount();

    loadQuizData();

    loadContestData();

    loadLeaderboard();
  }, []);

  /* ================= PROBLEMS ================= */

  const fetchProblemCount =
    async () => {
      try {
        const res =
          await axios.get(
            "/api/problems"
          );

        setProblemCount(
          res.data.data
            ?.length || 0
        );
      } catch (err) {
        console.log(err);
      }
    };

  /* ================= QUIZZES ================= */

  const loadQuizData =
    () => {
      const saved =
        localStorage.getItem(
          "teacher_quizzes"
        );

      if (saved) {
        const parsed =
          JSON.parse(
            saved
          );

        setQuizCount(
          parsed.length
        );

        setRecentQuizzes(
          parsed.slice(0, 4)
        );
      }
    };

  /* ================= CONTESTS ================= */

  const loadContestData =
    () => {
      const saved =
        localStorage.getItem(
          "weekly_contests"
        );

      if (saved) {
        const parsed =
          JSON.parse(
            saved
          );

        setContestCount(
          parsed.length
        );
      }
    };

  /* ================= LEADERBOARD ================= */

  const loadLeaderboard =
    () => {
      const saved =
        localStorage.getItem(
          "contest_leaderboard"
        );

      if (saved) {
        const parsed =
          JSON.parse(
            saved
          );

        if (
          parsed.length > 0
        ) {
          setTopStudent(
            parsed[0]
          );
        }
      }
    };

  /* ================= AVG SCORE ================= */

  const avgScore =
    useMemo(() => {
      if (!topStudent)
        return "0%";

      return `${Math.min(
        100,
        Math.floor(
          topStudent.score /
            10
        )
      )}%`;
    }, [topStudent]);

  /* ================= NAVIGATION ================= */

  const goToProblems =
    () => {
      navigate(
        "/problems-bank"
      );
    };

  const goToQuizzes =
    () => {
      navigate(
        "/quiz-management"
      );
    };

  const goToSchedule =
    () => {
      navigate(
        "/schedule"
      );
    };

  const goToLeaderboard =
    () => {
      navigate(
        "/leaderboard"
      );
    };

  const goToContests =
    () => {
      navigate(
        "/homeworks"
      );
    };

  return (
    <div className="space-y-7">

      {/* HERO */}

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 p-8 shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h1 className="text-4xl font-bold text-white mb-3">

              Welcome back 👋

            </h1>

            <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">

              Manage coding contests, quizzes,
              problems and student performance
              with your modern CodeArena dashboard.

            </p>

          </div>

          <div className="flex gap-3">

            <Button
              variant="primary"
              onClick={
                goToQuizzes
              }
              className="!bg-violet-600 hover:!bg-violet-700 border-none"
            >
              Create Quiz
            </Button>

            <Button
              variant="secondary"
              onClick={
                goToContests
              }
              className="bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black"
            >
              Weekly Contest
            </Button>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Weekly Contests"
          value={
            contestCount
          }
          icon={
            Trophy
          }
          color="bg-amber-500"
        />

        <StatCard
          title="Active Quizzes"
          value={
            quizCount
          }
          icon={BarChart2}
          color="bg-violet-600"
        />

        <StatCard
          title="Problems Posted"
          value={
            problemCount
          }
          icon={Code}
          color="bg-blue-600"
        />

        <StatCard
          title="Average Score"
          value={
            avgScore
          }
          icon={BarChart}
          color="bg-emerald-500"
        />

      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* RECENT ACTIVITY */}

        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                Recent Activity

              </h2>

              <p className="text-slate-500 mt-1">

                Latest coding platform activity

              </p>

            </div>

            <button
              onClick={
                goToLeaderboard
              }
              className="text-violet-600 hover:text-violet-700 text-sm font-semibold flex items-center gap-1"
            >

              View All

              <ArrowRight className="w-4 h-4" />

            </button>

          </div>

          <div className="space-y-4">

            {recentActivities.map(
              (act) => (
                <div
                  key={act.id}
                  className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition"
                >

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">

                    {act.avatar}

                  </div>

                  <div className="flex-1">

                    <p className="font-semibold text-slate-800">

                      {act.name}

                    </p>

                    <p className="text-sm text-slate-500 mt-1">

                      {act.action}

                    </p>

                  </div>

                  <span className="text-xs text-slate-400">

                    {act.time}

                  </span>

                </div>
              )
            )}

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="space-y-6">

          {/* QUICK ACTIONS */}

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

            <h2 className="text-2xl font-bold text-slate-800 mb-5">

              Quick Actions

            </h2>

            <div className="space-y-3">

              <Button
                variant="primary"
                onClick={
                  goToQuizzes
                }
                className="w-full"
              >
                + Create Quiz
              </Button>

              <Button
                variant="secondary"
                onClick={
                  goToProblems
                }
                className="w-full"
              >
                Add Problem
              </Button>

              <Button
                variant="secondary"
                onClick={
                  goToContests
                }
                className="w-full"
              >
                Weekly Contest
              </Button>

              <Button
                variant="secondary"
                onClick={
                  goToSchedule
                }
                className="w-full"
              >
                Schedule Class
              </Button>

            </div>

          </div>

          {/* TOP PERFORMER */}

          {topStudent && (
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-violet-900 to-slate-800 p-6 shadow-xl text-white">

              <div className="flex items-center gap-2 mb-5">

                <Trophy className="w-6 h-6 text-yellow-400" />

                <h2 className="text-xl font-bold">

                  Top Performer

                </h2>

              </div>

              <div className="space-y-4">

                <div>

                  <p className="text-3xl font-bold">

                    {
                      topStudent.name
                    }

                  </p>

                  <p className="text-slate-300 mt-1">

                    Leading this week

                  </p>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">

                    <p className="text-sm text-slate-300">

                      Score

                    </p>

                    <h3 className="text-2xl font-bold mt-1">

                      {
                        topStudent.score
                      }

                    </h3>

                  </div>

                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">

                    <p className="text-sm text-slate-300">

                      Solved

                    </p>

                    <h3 className="text-2xl font-bold mt-1">

                      {
                        topStudent.solved
                      }

                    </h3>

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* RECENT QUIZZES */}

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">

              Recent Quizzes

            </h2>

            <p className="text-slate-500 mt-1">

              Recently created coding assessments

            </p>

          </div>

          <button
            onClick={
              goToQuizzes
            }
            className="text-violet-600 hover:text-violet-700 text-sm font-semibold flex items-center gap-1"
          >

            View All

            <ArrowRight className="w-4 h-4" />

          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead>

              <tr className="border-b text-left text-slate-500 text-sm">

                <th className="pb-4">
                  Quiz
                </th>

                <th className="pb-4">
                  Subject
                </th>

                <th className="pb-4">
                  Questions
                </th>

                <th className="pb-4">
                  Due Date
                </th>

                <th className="pb-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentQuizzes.map(
                (q) => (
                  <tr
                    key={q.id}
                    className="border-b border-gray-100 hover:bg-slate-50 transition"
                  >

                    <td className="py-5 font-semibold text-slate-800">

                      {q.title}

                    </td>

                    <td className="py-5 text-slate-600">

                      {q.subject}

                    </td>

                    <td className="py-5 text-slate-600">

                      {
                        q.questions
                      }

                    </td>

                    <td className="py-5 text-slate-600">

                      {
                        q.dueDate
                      }

                    </td>

                    <td className="py-5">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          q.status ===
                          "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : q.status ===
                              "Draft"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >

                        {q.status}

                      </span>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}