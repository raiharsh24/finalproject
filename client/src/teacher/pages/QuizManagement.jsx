import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import QuizTable from "../components/QuizTable";
import Modal from "../components/Modal";
import Button from "../components/Button";

import {
  quizzes as initialQuizzes,
} from "../data/quizzes";

import {
  Plus,
  Search,
  Timer,
  FileText,
  CalendarDays,
} from "lucide-react";

export default function QuizManagement() {
  const [quizzes,
    setQuizzes] =
    useState([]);

  const [filter,
    setFilter] =
    useState("All");

  const [search,
    setSearch] =
    useState("");

  const [isModalOpen,
    setModalOpen] =
    useState(false);

  const [editQuiz,
    setEditQuiz] =
    useState(null);

  const [form,
    setForm] =
    useState({
      title: "",
      subject: "",
      questions: "",
      timeLimit: "",
      dueDate: "",
      status: "Draft",
      description: "",
    });

  /* ================= LOAD ================= */

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "teacher_quizzes"
      );

    if (saved) {
      setQuizzes(
        JSON.parse(saved)
      );
    } else {
      setQuizzes(
        initialQuizzes
      );

      localStorage.setItem(
        "teacher_quizzes",
        JSON.stringify(
          initialQuizzes
        )
      );
    }
  }, []);

  /* ================= SAVE ================= */

  useEffect(() => {
    if (
      quizzes.length > 0
    ) {
      localStorage.setItem(
        "teacher_quizzes",
        JSON.stringify(
          quizzes
        )
      );
    }
  }, [quizzes]);

  /* ================= FILTER ================= */

  const filtered =
    useMemo(() => {
      return quizzes.filter(
        (q) => {
          const matchesStatus =
            filter ===
              "All" ||
            q.status ===
              filter;

          const matchesSearch =
            q.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            q.subject
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          return (
            matchesStatus &&
            matchesSearch
          );
        }
      );
    }, [
      quizzes,
      filter,
      search,
    ]);

  /* ================= CREATE ================= */

  const openCreate =
    () => {
      setEditQuiz(null);

      setForm({
        title: "",
        subject: "",
        questions: "",
        timeLimit: "",
        dueDate: "",
        status: "Draft",
        description: "",
      });

      setModalOpen(true);
    };

  /* ================= EDIT ================= */

  const openEdit =
    (quiz) => {
      setEditQuiz(quiz);

      setForm({
        ...quiz,
      });

      setModalOpen(true);
    };

  /* ================= SAVE ================= */

  const handleSave =
    () => {
      if (
        !form.title ||
        !form.subject
      ) {
        alert(
          "Please fill required fields"
        );

        return;
      }

      if (editQuiz) {
        const updated =
          quizzes.map(
            (q) =>
              q.id ===
              editQuiz.id
                ? {
                    ...form,
                    id: editQuiz.id,
                  }
                : q
          );

        setQuizzes(
          updated
        );
      } else {
        const newQuiz = {
          ...form,

          id: Date.now(),

          createdAt:
            new Date().toISOString(),
        };

        setQuizzes(
          (prev) => [
            newQuiz,
            ...prev,
          ]
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
          "Delete this quiz?"
        );

      if (!confirmed)
        return;

      const updated =
        quizzes.filter(
          (q) =>
            q.id !== id
        );

      setQuizzes(
        updated
      );
    };

  /* ================= STATS ================= */

  const activeCount =
    quizzes.filter(
      (q) =>
        q.status ===
        "Active"
    ).length;

  const draftCount =
    quizzes.filter(
      (q) =>
        q.status ===
        "Draft"
    ).length;

  const completedCount =
    quizzes.filter(
      (q) =>
        q.status ===
        "Completed"
    ).length;

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-semibold text-gray-800">

            Quiz Management

          </h1>

          <p className="text-gray-500 mt-1">

            Manage coding quizzes,
            contests and
            assignments.

          </p>

        </div>

        <Button
          variant="primary"
          onClick={
            openCreate
          }
        >

          <Plus className="w-4 h-4 mr-2" />

          Create New Quiz

        </Button>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border rounded-xl shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Active Quizzes

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {activeCount}

              </h2>

            </div>

            <Timer className="w-8 h-8 text-indigo-500" />

          </div>

        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Drafts

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {draftCount}

              </h2>

            </div>

            <FileText className="w-8 h-8 text-yellow-500" />

          </div>

        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">

                Completed

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {completedCount}

              </h2>

            </div>

            <CalendarDays className="w-8 h-8 text-green-500" />

          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white border rounded-xl shadow-sm p-4">

        <div className="relative">

          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search quizzes..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target
                  .value
              )
            }
            className="w-full border rounded-lg py-2 pl-10 pr-4 outline-none"
          />

        </div>

      </div>

      {/* FILTERS */}

      <div className="flex flex-wrap gap-2">

        {[
          "All",
          "Active",
          "Draft",
          "Completed",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setFilter(
                tab
              )
            }
            className={`px-4 py-2 rounded-lg transition ${
              filter === tab
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      {/* TABLE */}

      <QuizTable
        quizzes={filtered}
        onEdit={
          openEdit
        }
        onDelete={
          handleDelete
        }
      />

      {/* MODAL */}

      <Modal
        isOpen={
          isModalOpen
        }
        onClose={() =>
          setModalOpen(
            false
          )
        }
      >

        <h2 className="text-2xl font-semibold mb-5">

          {editQuiz
            ? "Edit Quiz"
            : "Create Quiz"}

        </h2>

        <div className="space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              placeholder="Quiz Title"
              value={
                form.title
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  title:
                    e.target
                      .value,
                })
              }
              className="border rounded-lg p-3"
            />

            <input
              placeholder="Subject"
              value={
                form.subject
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  subject:
                    e.target
                      .value,
                })
              }
              className="border rounded-lg p-3"
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <input
              placeholder="Questions"
              value={
                form.questions
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  questions:
                    e.target
                      .value,
                })
              }
              className="border rounded-lg p-3"
            />

            <input
              placeholder="Time Limit"
              value={
                form.timeLimit
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  timeLimit:
                    e.target
                      .value,
                })
              }
              className="border rounded-lg p-3"
            />

            <input
              type="date"
              value={
                form.dueDate
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  dueDate:
                    e.target
                      .value,
                })
              }
              className="border rounded-lg p-3"
            />

          </div>

          <select
            value={
              form.status
            }
            onChange={(e) =>
              setForm({
                ...form,
                status:
                  e.target
                    .value,
              })
            }
            className="border rounded-lg p-3 w-full"
          >

            <option value="Active">
              Active
            </option>

            <option value="Draft">
              Draft
            </option>

            <option value="Completed">
              Completed
            </option>

          </select>

          <textarea
            rows={5}
            placeholder="Quiz description"
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target
                    .value,
              })
            }
            className="w-full border rounded-lg p-3"
          />

        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-3 mt-6">

          <Button
            variant="secondary"
            onClick={() =>
              setModalOpen(
                false
              )
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
            {editQuiz
              ? "Update Quiz"
              : "Create Quiz"}
          </Button>

        </div>

      </Modal>

    </div>
  );
}