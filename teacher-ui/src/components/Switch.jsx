import React from 'react';

export default function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${checked ? 'bg-primary' : 'bg-gray-300'}`}
    >
      <span
        className={`transform bg-white rounded-full h-5 w-5 transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`}
      />
    </button>
  );
}
