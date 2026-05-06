import React from "react";

import {
  Edit,
  Trash2,
  CalendarDays,
  Clock3,
} from "lucide-react";

export default function QuizTable({
  quizzes,
  onEdit,
  onDelete,
}) {
  if (!quizzes.length) {
    return (
      <div className="bg-white rounded-lg shadow border p-10 text-center text-gray-500">
        No quizzes found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full table-auto">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Quiz Title
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Subject
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Questions
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Time Limit
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Due Date
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {quizzes.map((q) => (
              <tr
                key={q.id}
                className="border-b hover:bg-purple-50/40 transition"
              >

                <td className="px-4 py-4">

                  <div className="font-medium text-gray-800">

                    {q.title}

                  </div>

                </td>

                <td className="px-4 py-4 text-gray-600">

                  {q.subject}

                </td>

                <td className="px-4 py-4 text-center">

                  {q.questions}

                </td>

                <td className="px-4 py-4 text-center">

                  <div className="inline-flex items-center gap-1 text-gray-600">

                    <Clock3 className="w-4 h-4" />

                    {q.timeLimit}

                  </div>

                </td>

                <td className="px-4 py-4">

                  <div className="inline-flex items-center gap-1 text-gray-600">

                    <CalendarDays className="w-4 h-4" />

                    {q.dueDate}

                  </div>

                </td>

                <td className="px-4 py-4">

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      q.status ===
                      "Active"
                        ? "bg-green-100 text-green-700"
                        : q.status ===
                          "Draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >

                    {q.status}

                  </span>

                </td>

                <td className="px-4 py-4">

                  <div className="flex items-center justify-center gap-3">

                    <button
                      onClick={() =>
                        onEdit(q)
                      }
                      className="text-indigo-600 hover:text-indigo-800 transition"
                    >

                      <Edit className="w-5 h-5" />

                    </button>

                    <button
                      onClick={() =>
                        onDelete(
                          q.id
                        )
                      }
                      className="text-red-500 hover:text-red-700 transition"
                    >

                      <Trash2 className="w-5 h-5" />

                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}