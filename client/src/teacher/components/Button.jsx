import React from "react";

export default function Button({
  children,
  className = "",
  variant = "primary",
  onClick,
  type = "button",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95",

    secondary:
      "bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95",

    outline:
      "bg-transparent border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${
        variants[variant] || variants.primary
      } ${className}`}
    >
      {children}
    </button>
  );
}