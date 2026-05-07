import { Bell, Mail } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Student Dashboard</h1>
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <Mail size={20} />
        <Bell size={20} />
        {/* Placeholder for user avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-400" />
      </div>
    </header>
  );
}
