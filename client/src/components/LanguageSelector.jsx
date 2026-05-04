import React from 'react';

export default function LanguageSelector({ language, setLanguage }) {
  const options = [
    { value: 'cpp', label: 'C++' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' }
  ];

  return (
    <select
      value={language}
      onChange={e => setLanguage(e.target.value)}
      className="px-2 py-1 rounded bg-primary text-white border border-accent"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
