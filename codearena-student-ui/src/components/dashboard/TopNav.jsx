import { Bell, Mail, User } from 'lucide-react';

export default function DashboardTopNav({ onMenuClick }) {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-sm rounded-b-3xl">
      {/* Mobile hamburger */}
      <button
        className="md:hidden text-gray-600 dark:text-gray-300"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1 flex items-center justify-center md:justify-start space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-full px-4 py-1 focus:outline-none focus:border-blue-500 w-64"
        />
      </div>
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <Mail size={20} />
        <Bell size={20} />
        {/* XP & Rank cards */}
        <div className="flex items-center space-x-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
          <span className="text-sm font-medium">XP: 1240</span>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
          <span className="text-sm font-medium">Rank: 12</span>
        </div>
        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-gray-400 flex items-center justify-center text-white">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}
