import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

import PageTitle from './PageTitle';
export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
      {/* Title - will be set by each page via document.title or passed via context; placeholder */}
      <PageTitle />
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Course, theme, author"
            className="pl-10 pr-4 py-1.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {/* Notification Bell */}
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        {/* Divider */}
        <div className="w-px h-6 bg-border-divider" />
        {/* Avatar and user info */}
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium text-white">
            AK
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-gray-800">Anastasiia K</span>
            <span className="text-gray-500">UX/UI Designer</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
}
