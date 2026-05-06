import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Button from "../components/Button";
import Modal from "../components/Modal";

import {
  Plus,
  Trophy,
  Clock3,
  Users,
  Trash2,
  Pencil,
  Sparkles,
} from "lucide-react";

import { toast } from "../components/Toast";

/* ================= INITIAL ================= */

const initialContests = [
  {
    id: 1,
    title: "Weekly DSA Contest #1",
    type: "DSA",
    startDate: "2026-05-08",
    endDate: "2026-05-08",
    duration: "90 mins",
    participants: 42,
    status: "Upcoming",
  },

  {
    id: 2,
    title: "Frontend Challenge",
    type: "Web Dev",
    startDate: "2026-05-05",
    endDate: "2026-05-05",
    duration: "120 mins",
    participants: 31,
    status: "Active",
  },

  {
    id: 3,
    title: "Algorithm Arena",
    type: "Algorithms",
    startDate: "2026-04-28",
    endDate: "2026-04-28",
    duration: "60 mins",
    participants: 58,
    status: "Completed",
  },
];

export default function Homeworks() {

  const [contests,
    setContests] =
    useState([]);

  const [modalOpen,
    setModalOpen] =
    useState(false);

  const [filter,
    setFilter] =
    useState("All");

  const [editContest,
    setEditContest] =
    useState(null);

  const [form,
    setForm] =
    useState({
      title: "",
      type: "DSA",
      startDate: "",
      endDate: "",
      duration: "",
      participants: 0,
      status: "Upcoming",
    });

  /* ================= LOAD ================= */

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "weekly_contests"
      );

    if (saved) {
      setContests(
        JSON.parse(saved)
      );
    } else {
      setContests(
        initialContests
      );
    }

  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {

    if (
      contests.length > 0
    ) {
      localStorage.setItem(
        "weekly_contests",
        JSON.stringify(
          contests
        )
      );
    }

  }, [contests]);

  /* ================= FILTER ================= */

  const filteredContests =
    useMemo(() => {

      return contests.filter(
        (c) =>
          filter === "All" ||
          c.status === filter
      );

    }, [
      contests,
      filter,
    ]);

  /* ================= MODAL ================= */

  const openModal =
    () => {

      setEditContest(
        null
      );

      setForm({
        title: "",
        type: "DSA",
        startDate: "",
        endDate: "",
        duration: "",
        participants: 0,
        status: "Upcoming",
      });

      setModalOpen(true);
    };

  const handleEdit =
    (contest) => {

      setEditContest(
        contest
      );

      setForm({
        ...contest,
      });

      setModalOpen(true);
    };

  /* ================= SAVE ================= */

  const handleSave =
    () => {

      if (
        !form.title
      ) {
        toast(
          "Contest title required"
        );

        return;
      }

      if (editContest) {

        const updated =
          contests.map(
            (c) =>
              c.id ===
              editContest.id
                ? {
                    ...form,
                    id:
                      editContest.id,
                  }
                : c
          );

        setContests(
          updated
        );

        toast(
          "Contest updated"
        );

      } else {

        const newContest = {
          ...form,
          id: Date.now(),
        };

        setContests(
          (prev) => [
            newContest,
            ...prev,
          ]
        );

        toast(
          "Contest created"
        );
      }

      setModalOpen(
        false
      );
    };

  /* ================= DELETE ================= */

  const handleDelete =
    (id) => {

      const confirmed =
        window.confirm(
          "Delete this contest?"
        );

      if (!confirmed)
        return;

      setContests(
        (prev) =>
          prev.filter(
            (c) =>
              c.id !== id
          )
      );

      toast(
        "Contest deleted"
      );
    };

  /* ================= COUNTS ================= */

  const activeCount =
    contests.filter(
      (c) =>
        c.status ===
        "Active"
    ).length;

  const upcomingCount =
    contests.filter(
      (c) =>
        c.status ===
        "Upcoming"
    ).length;

  const completedCount =
    contests.filter(
      (c) =>
        c.status ===
        "Completed"
    ).length;

  return (
    <div className="space-y-7">

      {/* HERO */}

      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-8 shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-3 mb-4">

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">

                <Trophy className="w-7 h-7 text-yellow-400" />

              </div>

              <div>

                <h1 className="text-4xl font-bold text-white">

                  Weekly Contests

                </h1>

                <p className="text-slate-300 mt-1">

                  Manage coding competitions and student rankings

                </p>

              </div>

            </div>

          </div>

          <Button
            variant="primary"
            onClick={
              openModal
            }
            className="!bg-indigo-600 hover:!bg-indigo-700 border-none"
          >

            <Plus className="w-4 h-4 mr-2" />

            Create Contest

          </Button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">

          <p className="text-slate-500 text-sm">
            Active Contests
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-3">
            {activeCount}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">

          <p className="text-slate-500 text-sm">
            Upcoming
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-3">
            {upcomingCount}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition">

          <p className="text-slate-500 text-sm">
            Completed
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-3">
            {completedCount}
          </h2>

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-3">

        {[
          "All",
          "Active",
          "Upcoming",
          "Completed",
        ].map((tab) => (

          <button
            key={tab}
            onClick={() =>
              setFilter(tab)
            }
            className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
              filter === tab
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "bg-white border border-gray-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >

            {tab}

          </button>
        ))}

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">

        <div className="px-7 py-6 border-b border-gray-100 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">

              Contest Management

            </h2>

            <p className="text-slate-500 mt-1">

              Organize and manage weekly coding contests

            </p>

          </div>

          <Sparkles className="w-6 h-6 text-indigo-500" />

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Contest
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Type
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Duration
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Schedule
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Participants
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredContests.map(
                (c) => (

                  <tr
                    key={c.id}
                    className="border-b border-gray-100 hover:bg-slate-50 transition"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center">

                          <Trophy className="w-5 h-5 text-indigo-600" />

                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {c.title}
                          </p>

                          <p className="text-sm text-slate-500 mt-1">
                            Weekly coding challenge
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {c.type}
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-slate-600">

                        <Clock3 className="w-4 h-4" />

                        {c.duration}

                      </div>

                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">

                      {c.startDate}

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-slate-700">

                        <Users className="w-4 h-4 text-slate-400" />

                        {c.participants}

                      </div>

                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          c.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : c.status === "Upcoming"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >

                        {c.status}

                      </span>

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <button
                          onClick={() =>
                            handleEdit(c)
                          }
                          className="text-indigo-600 hover:text-indigo-800 transition"
                        >

                          <Pencil className="w-4 h-4" />

                        </button>

                        <button
                          onClick={() =>
                            handleDelete(c.id)
                          }
                          className="text-red-500 hover:text-red-700 transition"
                        >

                          <Trash2 className="w-4 h-4" />

                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      <Modal
        isOpen={
          modalOpen
        }
        onClose={() =>
          setModalOpen(false)
        }
      >

        <div className="p-2">

          <h2 className="text-3xl font-bold text-slate-800 mb-2">

            {editContest
              ? "Edit Contest"
              : "Create Contest"}

          </h2>

          <p className="text-slate-500 mb-6">

            Configure your coding competition details

          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              placeholder="Contest Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >

              <option>DSA</option>

              <option>Algorithms</option>

              <option>Web Dev</option>

              <option>Competitive Programming</option>

            </select>

            <input
              type="date"
              value={form.startDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  startDate: e.target.value,
                })
              }
              className="border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              type="date"
              value={form.endDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  endDate: e.target.value,
                })
              }
              className="border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              placeholder="Duration (eg 90 mins)"
              value={form.duration}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration: e.target.value,
                })
              }
              className="border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="border border-gray-200 rounded-2xl p-3.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >

              <option>Upcoming</option>

              <option>Active</option>

              <option>Completed</option>

            </select>

          </div>

          <div className="flex justify-end gap-3 mt-8">

            <Button
              variant="secondary"
              onClick={() =>
                setModalOpen(false)
              }
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              onClick={
                handleSave
              }
            >

              {editContest
                ? "Update Contest"
                : "Create Contest"}

            </Button>

          </div>

        </div>

      </Modal>

    </div>
  );
}