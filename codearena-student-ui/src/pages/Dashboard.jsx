import { motion } from 'framer-motion';
import Hero from '../components/dashboard/Hero';
import StatCards from '../components/dashboard/StatCards';
import DashboardTopNav from '../components/dashboard/TopNav';
import DashboardSidebar from '../components/dashboard/Sidebar';
import ContinueLearningCard from '../components/dashboard/ContinueLearningCard';
import AIMentorCard from '../components/dashboard/AIMentorCard';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import Heatmap from '../components/dashboard/Heatmap';
import RecommendedProblems from '../components/dashboard/RecommendedProblems';
import Leaderboard from '../components/dashboard/Leaderboard';
import RecentActivity from '../components/dashboard/RecentActivity';
import PerformanceAnalytics from '../components/dashboard/PerformanceAnalytics';
import AchievementBadges from '../components/dashboard/AchievementBadges';

import { useState } from 'react';
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-[#f5f5f5] dark:bg-[#1a1a1a] overflow-hidden">
      {/* Sidebar for desktop */}
      <div className="hidden md:block flex-shrink-0">
        <DashboardSidebar />
      </div>
      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64">
            <DashboardSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopNav onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-auto px-8 xl:px-10 py-6 min-w-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            className="grid grid-cols-12 gap-6 auto-rows-auto w-full"
          >
            {/* Row 1: Hero + XP + Rank */}
            <div className="col-span-12 lg:col-span-8">
              <Hero />
            </div>
            <div className="col-span-6 lg:col-span-2 flex items-center justify-center bg-white/70 backdrop-blur rounded-3xl shadow-xl">
              <div className="text-center">
                <p className="text-sm text-gray-500">XP Points</p>
                <p className="text-2xl font-bold text-gray-800">1240</p>
              </div>
            </div>
            <div className="col-span-6 lg:col-span-2 flex items-center justify-center bg-white/70 backdrop-blur rounded-3xl shadow-xl">
              <div className="text-center">
                <p className="text-sm text-gray-500">Rank</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
            </div>

            {/* Row 2: Stat cards (4 cards) */}
            <div className="col-span-12 lg:col-span-3">
              <StatCards />
            </div>

            {/* Row 3: Continue Learning, AI Mentor, Upcoming Tasks */}
            <div className="col-span-12 lg:col-span-4">
              <ContinueLearningCard />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <AIMentorCard />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <UpcomingTasks />
            </div>

            {/* Row 4: Heatmap, Problems, Leaderboard */}
            <div className="col-span-12 lg:col-span-4">
              <Heatmap />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <RecommendedProblems />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <Leaderboard />
            </div>

            {/* Row 5: Recent Activity, Analytics, Badges */}
            <div className="col-span-12 lg:col-span-4">
              <RecentActivity />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <PerformanceAnalytics />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <AchievementBadges />
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
