import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  ClipboardList,
  Calendar,
  MessageSquare,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  FileText,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/library', label: 'Library', icon: BookOpen },
  { to: '/quiz-management', label: 'Quiz Management', icon: Layers },
  { to: '/problems-bank', label: 'Problems Bank', icon: FileText },
  { to: '/homeworks', label: 'Homeworks', icon: ClipboardList },
  { to: '/schedule', label: 'Schedule', icon: Calendar },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-sidebar-bg text-sidebar-text flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div className="flex items-center space-x-2 px-4 py-6">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="text-Blue font-bold text-lg">Welcome to CodeArena</span>
        </div>
        {/* Nav items */}
        <nav className="mt-2 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center mx-2 px-3 py-2 rounded-full transition-colors
                ${isActive ? 'bg-sidebar-active text-white' : 'text-sidebar-text hover:bg-gray-700/30'}
              `
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      {/* Bottom items */}
      <div className="mb-4 space-y-1 px-2">
        <button className="flex w-full items-center px-3 py-2 rounded-full text-sidebar-text hover:bg-gray-700/30 transition-colors">
          <HelpCircle className="w-5 h-5 mr-3" />
          <span className="font-medium">Help</span>
        </button>
        <button className="flex w-full items-center px-3 py-2 rounded-full text-sidebar-text hover:bg-gray-700/30 transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
