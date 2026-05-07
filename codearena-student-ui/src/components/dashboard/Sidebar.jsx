import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  BarChart2,
  Users,
  Settings,
  Code,
  Trophy,
  MessageSquare,
  BookOpen,
  Calendar,
  User as UserIcon,
  LogOut,
  Award,
} from 'lucide-react';

// Navigation items definition
const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'Practice Arena', to: '/practice', icon: Code },
  { label: 'AI Mentor', to: '/ai-mentor', icon: BarChart2 },
  { label: 'Contests', to: '/contests', icon: Trophy },
  { label: 'Assignments', to: '/assignments', icon: BookOpen },
  { label: 'Leaderboard', to: '/leaderboard', icon: Users },
  { label: 'Discussions', to: '/discussions', icon: MessageSquare },
  { label: 'Notes', to: '/notes', icon: Calendar },
  { label: 'Certificates', to: '/certificates', icon: Award },
  { label: 'Profile', to: '/profile', icon: UserIcon },
  { label: 'Settings', to: '/settings', icon: Settings },
];

export default function DashboardSidebar({ onClose }) {
  const location = useLocation();

  return (
    <nav className="h-full w-72 bg-gradient-to-b from-[#0b1020] to-[#111827] text-white p-6 flex flex-col justify-between rounded-r-3xl shadow-xl overflow-y-auto">
      {/* Mobile close button */}
      <button
        className="md:hidden text-gray-300 mb-4"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        ✕
      </button>
      {/* Logo */}
      <div className="text-2xl font-extrabold mb-8 text-center" style={{ background: 'linear-gradient(45deg, #7c3aed, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        CodeArena.AI
      </div>
      {/* Navigation */}
      <ul className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <motion.li
              key={item.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                to={item.to}
                className={`flex items-center gap-3 py-2 px-4 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-300'} />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
      {/* Bottom section */}
      <div className="mt-6 space-y-4">
        {/* Streak card */}
        <div className="p-4 bg-white/10 rounded-xl backdrop-blur border border-white/20">
          <p className="text-sm">Current Streak</p>
          <p className="text-xl font-bold">5 days</p>
        </div>
        {/* Upgrade card */}
        <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-xl text-center">
          <p className="font-medium mb-2">Start Quiz</p>
          <button className="w-full bg-white text-purple-700 font-medium py-1 rounded">Click Here</button>
        </div>
        {/* Logout */}
        <button
          onClick={() => {}}
          className="flex items-center gap-2 w-full py-2 px-3 rounded hover:bg-white/10"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
