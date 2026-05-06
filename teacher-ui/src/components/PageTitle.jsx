import React from 'react';
import { useLocation } from 'react-router-dom';

const titles = {
  '/dashboard': 'Dashboard',
  '/messages': 'Messages',
  '/quiz-management': 'Quiz Management',
  '/problems-bank': 'Problems Bank',
  '/schedule': 'Schedule',
  '/library': 'Library',
  '/problems-bank': 'Problems Bank',
  '/homeworks': 'Homeworks',
  '/settings': 'Settings',
};

export default function PageTitle() {
  const { pathname } = useLocation();
  const title = titles[pathname] || 'Dashboard';
  return <h1 className="text-xl font-semibold text-gray-800">{title}</h1>;
}
