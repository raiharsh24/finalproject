import React from "react";
import {
  Tag,
  Pencil,
  Trash2,
  CheckCircle2,
  Users,
  Clock3,
} from "lucide-react";

export default function ProblemCard({
  problem,
  onEdit,
  onDelete,
}) {
  const difficultyColors = {
    Easy:
      "bg-green-100 text-green-700 border border-green-200",

    Medium:
      "bg-yellow-100 text-yellow-700 border border-yellow-200",

    Hard:
      "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

      {/* TOP */}

      <div className="p-5 flex-1 flex flex-col">

        <div className="flex items-start justify-between gap-3">

          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              difficultyColors[
                problem.difficulty
              ]
            }`}
          >
            {problem.difficulty}
          </span>

          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">

            {problem.subject}

          </span>

        </div>

        {/* TITLE */}

        <h3 className="font-semibold text-lg text-gray-800 mt-4 line-clamp-2">

          {problem.title}

        </h3>

        {/* DESCRIPTION */}

        <p
          className="text-sm text-gray-500 mt-3 leading-relaxed flex-1"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {problem.description}
        </p>

        {/* TAGS */}

        {problem.tags && (
          <div className="flex flex-wrap gap-2 mt-4">

            {String(problem.tags)
              .split(",")
              .slice(0, 4)
              .map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs"
                >
                  <Tag className="w-3 h-3" />

                  {tag.trim()}

                </div>
              ))}

          </div>
        )}

        {/* STATS */}

        <div className="grid grid-cols-3 gap-3 mt-5 border-t pt-4">

          <div className="text-center">

            <div className="flex justify-center mb-1">
              <Users className="w-4 h-4 text-gray-400" />
            </div>

            <p className="text-xs text-gray-400">
              Submissions
            </p>

            <h4 className="font-semibold text-sm">
              {problem.submissions || 0}
            </h4>

          </div>

          <div className="text-center">

            <div className="flex justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
            </div>

            <p className="text-xs text-gray-400">
              Acceptance
            </p>

            <h4 className="font-semibold text-sm">
              {problem.acceptance || "0%"}
            </h4>

          </div>

          <div className="text-center">

            <div className="flex justify-center mb-1">
              <Clock3 className="w-4 h-4 text-gray-400" />
            </div>

            <p className="text-xs text-gray-400">
              Difficulty
            </p>

            <h4 className="font-semibold text-sm">
              {problem.difficulty}
            </h4>

          </div>

        </div>

      </div>

      {/* FOOTER */}

      <div className="border-t px-5 py-3 bg-gray-50 flex items-center justify-between">

        <div className="text-xs text-gray-400">

          {problem.createdAt
            ? new Date(
                problem.createdAt
              ).toLocaleDateString()
            : "Recently created"}

        </div>

        <div className="flex items-center gap-2">

          <button
            onClick={() => onEdit(problem)}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition"
          >
            <Pencil className="w-4 h-4" />

            Edit
          </button>

          <button
            onClick={() => onDelete(problem.id)}
            className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium transition"
          >
            <Trash2 className="w-4 h-4" />

            Delete
          </button>

        </div>

      </div>

    </div>
  );
}