import React from 'react';
import { Tag } from 'lucide-react';

export default function ProblemCard({ problem, onEdit, onDelete }) {
  const difficultyColors = {
    Easy: 'bg-easy-badge-bg text-white',
    Medium: 'bg-medium-badge-bg text-white',
    Hard: 'bg-hard-badge-bg text-white',
  };
  return (
    <div className="bg-card-bg rounded-lg shadow p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-1 rounded ${difficultyColors[problem.difficulty]}`}>{problem.difficulty}</span>
        <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">{problem.subject}</span>
      </div>
      <h3 className="font-medium text-lg mb-1">{problem.title}</h3>
      <p className="text-sm text-gray-500 flex-1 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>{problem.description}</p>
      <div className="mt-3 flex space-x-2">
        <button onClick={() => onEdit(problem)} className="text-primary hover:underline">Edit</button>
        <button onClick={() => onDelete(problem.id)} className="text-red-500 hover:underline">Delete</button>
      </div>
    </div>
  );
}
