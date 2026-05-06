import React from 'react';

export default function Avatar({ initials, bgColor = 'bg-gray-500' }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${bgColor}`}>
      {initials}
    </div>
  );
}
