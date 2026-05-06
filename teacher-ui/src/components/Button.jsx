import React from 'react';

export default function Button({ children, className = '', variant = 'primary', onClick }) {
  const base = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover active:scale-95",
    secondary: "bg-white border border-primary text-primary hover:bg-primary hover:text-white active:scale-95",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white active:scale-95",
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant] || variants.primary} ${className}`}>
      {children}
    </button>
  );
}
