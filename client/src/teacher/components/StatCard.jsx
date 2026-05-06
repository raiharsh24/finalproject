import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        hover:border-violet-200
      "
    >
      {/* TOP GLOW */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-80"></div>

      <div className="flex items-center justify-between">

        {/* LEFT */}
        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>

        </div>

        {/* RIGHT ICON */}
        <div
          className={`
            h-14 w-14
            rounded-2xl
            flex items-center justify-center
            text-white
            shadow-lg
            transition-all duration-300
            group-hover:scale-110
            ${color || "bg-violet-600"}
          `}
        >
          {Icon && (
            <Icon className="w-6 h-6" />
          )}
        </div>

      </div>
    </div>
  );
}