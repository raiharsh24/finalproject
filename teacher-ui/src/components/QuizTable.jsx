import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function QuizTable({ quizzes, onEdit, onDelete }) {
  return (
    <table className="min-w-full table-auto">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Quiz Title</th>
          <th className="px-4 py-2 text-left">Subject</th>
          <th className="px-4 py-2 text-left">Questions</th>
          <th className="px-4 py-2 text-left">Time Limit</th>
          <th className="px-4 py-2 text-left">Due Date</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {quizzes.map((q) => (
          <tr key={q.id} className="border-b hover:bg-purple-50">
            <td className="px-4 py-2">{q.title}</td>
            <td className="px-4 py-2">{q.subject}</td>
            <td className="px-4 py-2 text-center">{q.questions}</td>
            <td className="px-4 py-2 text-center">{q.timeLimit}</td>
            <td className="px-4 py-2">{q.dueDate}</td>
            <td className="px-4 py-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                q.status === 'Active' ? 'bg-green-100 text-green-800' :
                q.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>{q.status}</span>
            </td>
            <td className="px-4 py-2 flex space-x-2">
              <button onClick={() => onEdit(q)} className="text-primary hover:text-primary-hover">
                <Edit className="w-5 h-5" />
              </button>
              <button onClick={() => onDelete(q.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-5 h-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
