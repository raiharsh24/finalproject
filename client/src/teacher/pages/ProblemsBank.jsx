import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import ProblemCard from "../components/ProblemCard";
import Modal from "../components/Modal";
import Button from "../components/Button";

import {
  Plus,
  Search,
  Code2,
  Filter,
} from "lucide-react";

import { toast } from "../components/Toast";

const API =
  "http://localhost:5000/api/problems";

export default function ProblemsBank() {
  const [problems, setProblems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filter, setFilter] =
    useState("All");

  const [search, setSearch] =
    useState("");

  const [
    difficultyFilter,
    setDifficultyFilter,
  ] = useState("All");

  const [isModalOpen, setModalOpen] =
    useState(false);

  const [editProblem, setEditProblem] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "DSA",
    difficulty: "Easy",
    description: "",
    tags: "",
    constraints: "",
    sampleInput: "",
    sampleOutput: "",
    hiddenInput: "",
    hiddenOutput: "",
  });

  /* ================= LOAD ================= */

  const fetchProblems = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      setProblems(res.data.data || []);
    } catch (err) {
      toast(
        err?.response?.data?.message ||
          "Failed to load problems"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  /* ================= FILTERS ================= */

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const subjectMatch =
        filter === "All" ||
        p.subject === filter;

      const difficultyMatch =
        difficultyFilter === "All" ||
        p.difficulty ===
          difficultyFilter;

      const searchMatch =
        p.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        p.description
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        subjectMatch &&
        difficultyMatch &&
        searchMatch
      );
    });
  }, [
    problems,
    filter,
    difficultyFilter,
    search,
  ]);

  /* ================= OPEN CREATE ================= */

  const openCreate = () => {
    setEditProblem(null);

    setForm({
      title: "",
      subject: "DSA",
      difficulty: "Easy",
      description: "",
      tags: "",
      constraints: "",
      sampleInput: "",
      sampleOutput: "",
      hiddenInput: "",
      hiddenOutput: "",
    });

    setModalOpen(true);
  };

  /* ================= OPEN EDIT ================= */

  const openEdit = (problem) => {
    setEditProblem(problem);

    setForm({
      title: problem.title || "",
      subject:
        problem.subject || "DSA",

      difficulty:
        problem.difficulty || "Easy",

      description:
        problem.description || "",

      tags:
        problem.tags?.join(", ") || "",

      constraints:
        problem.constraints || "",

      sampleInput:
        problem.sampleIO?.[0]?.input ||
        "",

      sampleOutput:
        problem.sampleIO?.[0]?.output ||
        "",

      hiddenInput:
        problem.hiddenTestCases?.[0]
          ?.input || "",

      hiddenOutput:
        problem.hiddenTestCases?.[0]
          ?.output || "",
    });

    setModalOpen(true);
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (
      !form.title ||
      !form.subject ||
      !form.description
    ) {
      toast(
        "Please fill all required fields"
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title,

        subject: form.subject,

        difficulty: form.difficulty,

        description:
          form.description,

        constraints:
          form.constraints,

        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),

        sampleIO: [
          {
            input: form.sampleInput,
            output:
              form.sampleOutput,
          },
        ],

        hiddenTestCases: [
          {
            input: form.hiddenInput,
            output:
              form.hiddenOutput,
          },
        ],

        starterCode: `#include <bits/stdc++.h>
using namespace std;

int main() {

    // Write your code here

    return 0;
}`,
      };

      if (editProblem) {
        await axios.put(
          `${API}/${editProblem._id}`,
          payload
        );

        toast(
          "Problem updated successfully"
        );
      } else {
        await axios.post(
          API,
          payload
        );

        toast(
          "Problem created successfully"
        );
      }

      await fetchProblems();

      setModalOpen(false);
    } catch (err) {
      toast(
        err?.response?.data?.message ||
          "Operation failed"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this problem?"
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `${API}/${id}`
      );

      setProblems((prev) =>
        prev.filter(
          (p) => p._id !== id
        )
      );

      toast("Problem deleted");
    } catch (err) {
      toast(
        err?.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  /* ================= FILTER DATA ================= */

  const subjects = [
    "All",
    "DSA",
    "Algorithms",
    "Web",
    "Database",
    "Math",
    "OS",
    "Networking",
  ];

  const difficulties = [
    "All",
    "Easy",
    "Medium",
    "Hard",
  ];

  /* ================= STATS ================= */

  const totalProblems =
    problems.length;

  const easyCount =
    problems.filter(
      (p) => p.difficulty === "Easy"
    ).length;

  const mediumCount =
    problems.filter(
      (p) =>
        p.difficulty === "Medium"
    ).length;

  const hardCount =
    problems.filter(
      (p) => p.difficulty === "Hard"
    ).length;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Problems Bank
          </h1>

          <p className="text-gray-500 mt-1">
            Manage coding problems
            for contests,
            assignments and quizzes.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openCreate}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Problem
        </Button>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-gray-500">
            Total Problems
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {totalProblems}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-green-600">
            Easy
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {easyCount}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-yellow-600">
            Medium
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {mediumCount}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-5">
          <p className="text-sm text-red-600">
            Hard
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {hardCount}
          </h2>
        </div>

      </div>

      {/* FILTERS */}

      <div className="bg-white rounded-xl shadow-sm border p-4">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>

          <div className="flex items-center gap-2 overflow-x-auto">

            <Filter className="w-4 h-4 text-gray-500" />

            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() =>
                  setFilter(sub)
                }
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                  filter === sub
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sub}
              </button>
            ))}

          </div>

        </div>

        <div className="flex gap-2 mt-4">

          {difficulties.map((level) => (
            <button
              key={level}
              onClick={() =>
                setDifficultyFilter(
                  level
                )
              }
              className={`px-3 py-1 rounded-md text-sm ${
                difficultyFilter ===
                level
                  ? "bg-black text-white"
                  : "bg-gray-100"
              }`}
            >
              {level}
            </button>
          ))}

        </div>

      </div>

      {/* EMPTY */}

      {!loading &&
        filteredProblems.length ===
          0 && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">

            <Code2 className="mx-auto w-12 h-12 text-gray-400 mb-4" />

            <h2 className="text-xl font-semibold">
              No problems found
            </h2>

            <p className="text-gray-500 mt-2">
              Try changing filters
              or create a new
              problem.
            </p>

          </div>
        )}

      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {filteredProblems.map(
          (problem) => (
            <ProblemCard
              key={problem._id}
              problem={problem}
              onEdit={() =>
                openEdit(problem)
              }
              onDelete={
                handleDelete
              }
            />
          )
        )}

      </div>

      {/* MODAL */}

      <Modal
        isOpen={isModalOpen}
        onClose={() =>
          setModalOpen(false)
        }
      >

        <h2 className="text-2xl font-semibold mb-6">

          {editProblem
            ? "Edit Problem"
            : "Create New Problem"}

        </h2>

        <div className="space-y-4">

          <input
            placeholder="Problem Title"
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <select
              value={form.subject}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject:
                    e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >
              {subjects
                .filter(
                  (s) =>
                    s !== "All"
                )
                .map((sub) => (
                  <option key={sub}>
                    {sub}
                  </option>
                ))}
            </select>

            <select
              value={
                form.difficulty
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty:
                    e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >
              <option>
                Easy
              </option>

              <option>
                Medium
              </option>

              <option>
                Hard
              </option>

            </select>

          </div>

          <textarea
            placeholder="Problem Description"
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={5}
          />

          <input
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) =>
              setForm({
                ...form,
                tags:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Constraints"
            value={
              form.constraints
            }
            onChange={(e) =>
              setForm({
                ...form,
                constraints:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={3}
          />

          <textarea
            placeholder="Sample Input"
            value={
              form.sampleInput
            }
            onChange={(e) =>
              setForm({
                ...form,
                sampleInput:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={3}
          />

          <textarea
            placeholder="Sample Output"
            value={
              form.sampleOutput
            }
            onChange={(e) =>
              setForm({
                ...form,
                sampleOutput:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={3}
          />

          <textarea
            placeholder="Hidden Test Input"
            value={
              form.hiddenInput
            }
            onChange={(e) =>
              setForm({
                ...form,
                hiddenInput:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={3}
          />

          <textarea
            placeholder="Hidden Test Output"
            value={
              form.hiddenOutput
            }
            onChange={(e) =>
              setForm({
                ...form,
                hiddenOutput:
                  e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={3}
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

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
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editProblem
              ? "Update Problem"
              : "Create Problem"}
          </Button>

        </div>

      </Modal>

    </div>
  );
}