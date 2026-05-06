import React, { useEffect, useMemo, useState } from "react";
import ProblemCard from "../components/ProblemCard";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { problems as initialProblems } from "../data/problems";
import { Plus, Search, Code2, Filter } from "lucide-react";
import { toast } from "../components/Toast";

export default function ProblemsBank() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const [isModalOpen, setModalOpen] = useState(false);
  const [editProblem, setEditProblem] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subject: "DSA",
    difficulty: "Easy",
    description: "",
    tags: "",
    testCases: "",
    constraints: "",
  });

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("teacher_problems");

    if (saved) {
      setProblems(JSON.parse(saved));
    } else {
      setProblems(initialProblems);
      localStorage.setItem(
        "teacher_problems",
        JSON.stringify(initialProblems)
      );
    }
  }, []);

  /* ---------------- SAVE DATA ---------------- */

  useEffect(() => {
    if (problems.length > 0) {
      localStorage.setItem(
        "teacher_problems",
        JSON.stringify(problems)
      );
    }
  }, [problems]);

  /* ---------------- FILTERS ---------------- */

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const subjectMatch =
        filter === "All" || p.subject === filter;

      const difficultyMatch =
        difficultyFilter === "All" ||
        p.difficulty === difficultyFilter;

      const searchMatch =
        p.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        p.description
          .toLowerCase()
          .includes(search.toLowerCase());

      return (
        subjectMatch &&
        difficultyMatch &&
        searchMatch
      );
    });
  }, [problems, filter, difficultyFilter, search]);

  /* ---------------- OPEN CREATE ---------------- */

  const openCreate = () => {
    setEditProblem(null);

    setForm({
      title: "",
      subject: "DSA",
      difficulty: "Easy",
      description: "",
      tags: "",
      testCases: "",
      constraints: "",
    });

    setModalOpen(true);
  };

  /* ---------------- OPEN EDIT ---------------- */

  const openEdit = (problem) => {
    setEditProblem(problem);

    setForm({
      ...problem,
      tags: problem.tags || "",
      testCases: problem.testCases || "",
      constraints: problem.constraints || "",
    });

    setModalOpen(true);
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = () => {
    if (
      !form.title ||
      !form.subject ||
      !form.description
    ) {
      toast("Please fill all required fields");
      return;
    }

    if (editProblem) {
      const updated = problems.map((p) =>
        p.id === editProblem.id
          ? {
              ...form,
              id: editProblem.id,
              updatedAt: new Date().toISOString(),
            }
          : p
      );

      setProblems(updated);

      toast("Problem updated successfully");
    } else {
      const newProblem = {
        ...form,
        id: Date.now(),
        submissions: 0,
        acceptance: "0%",
        createdAt: new Date().toISOString(),
      };

      setProblems((prev) => [newProblem, ...prev]);

      toast("Problem created successfully");
    }

    setModalOpen(false);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Delete this problem?"
    );

    if (!confirmed) return;

    const updated = problems.filter(
      (p) => p.id !== id
    );

    setProblems(updated);

    toast("Problem deleted");
  };

  /* ---------------- SUBJECTS ---------------- */

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

  /* ---------------- STATS ---------------- */

  const totalProblems = problems.length;

  const easyCount = problems.filter(
    (p) => p.difficulty === "Easy"
  ).length;

  const mediumCount = problems.filter(
    (p) => p.difficulty === "Medium"
  ).length;

  const hardCount = problems.filter(
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
            Manage coding problems for contests,
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

          {/* SEARCH */}

          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border rounded-lg py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* SUBJECT */}

          <div className="flex items-center gap-2 overflow-x-auto">

            <Filter className="w-4 h-4 text-gray-500" />

            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setFilter(sub)}
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

        {/* DIFFICULTY */}

        <div className="flex gap-2 mt-4">

          {difficulties.map((level) => (
            <button
              key={level}
              onClick={() =>
                setDifficultyFilter(level)
              }
              className={`px-3 py-1 rounded-md text-sm ${
                difficultyFilter === level
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

      {filteredProblems.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">

          <Code2 className="mx-auto w-12 h-12 text-gray-400 mb-4" />

          <h2 className="text-xl font-semibold">
            No problems found
          </h2>

          <p className="text-gray-500 mt-2">
            Try changing filters or create a new
            problem.
          </p>

        </div>
      )}

      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

        {filteredProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            onEdit={() => openEdit(problem)}
            onDelete={handleDelete}
          />
        ))}

      </div>

      {/* MODAL */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
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
                title: e.target.value,
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
                  subject: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >
              {subjects
                .filter((s) => s !== "All")
                .map((sub) => (
                  <option key={sub}>
                    {sub}
                  </option>
                ))}
            </select>

            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value,
                })
              }
              className="border rounded-lg p-3"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

          </div>

          <textarea
            placeholder="Problem Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
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
                tags: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Constraints"
            value={form.constraints}
            onChange={(e) =>
              setForm({
                ...form,
                constraints: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={3}
          />

          <textarea
            placeholder="Sample Test Cases"
            value={form.testCases}
            onChange={(e) =>
              setForm({
                ...form,
                testCases: e.target.value,
              })
            }
            className="w-full border rounded-lg p-3"
            rows={4}
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <Button
            variant="secondary"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
          >
            {editProblem
              ? "Update Problem"
              : "Create Problem"}
          </Button>

        </div>

      </Modal>

    </div>
  );
}