import React from 'react';
import StatCard from '../components/StatCard';
import { LayoutDashboard, BarChart2, Code, BarChart } from 'lucide-react';
import { recentActivities } from '../data/students';
import { quizzes } from '../data/quizzes';
import Button from '../components/Button';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value="142" icon={LayoutDashboard} color="bg-blue-500" />
        <StatCard title="Active Quizzes" value="8" icon={BarChart2} color="bg-primary" />
        <StatCard title="Problems Posted" value="34" icon={Code} color="bg-primary" />
        <StatCard title="Avg. Score" value="76%" icon={BarChart} color="bg-primary" />
      </div>

      {/* Main sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card-bg rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivities.map((act) => (
              <li key={act.id} className="flex items-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white mr-3">
                  {act.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{act.name}</p>
                  <p className="text-sm text-gray-500">{act.action}</p>
                </div>
                <span className="text-xs text-gray-400">{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Quick Actions */}
        <div className="bg-card-bg rounded-lg shadow p-4 flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col space-y-2">
            <Button variant="primary">+ Create New Quiz</Button>
            <Button variant="secondary">Add Problem</Button>
            <Button variant="secondary">Schedule Class</Button>
          </div>
        </div>
      </div>

      {/* Your Quizzes preview */}
      <div className="bg-card-bg rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Your Quizzes</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Subject</th>
              <th className="px-4 py-2 text-left">Questions</th>
              <th className="px-4 py-2 text-left">Due Date</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.slice(0, 3).map((q) => (
              <tr key={q.id} className="border-b">
                <td className="px-4 py-2">{q.title}</td>
                <td className="px-4 py-2">{q.subject}</td>
                <td className="px-4 py-2 text-center">{q.questions}</td>
                <td className="px-4 py-2">{q.dueDate}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    q.status === 'Active' ? 'bg-green-100 text-green-800' :
                    q.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>{q.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
