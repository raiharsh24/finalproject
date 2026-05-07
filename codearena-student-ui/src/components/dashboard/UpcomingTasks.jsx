import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

// Mock upcoming tasks data
const tasks = [
  { id: 1, title: 'Finish Dynamic Programming problem set', due: '2026-05-10', icon: <Calendar size={20} /> },
  { id: 2, title: 'Review AI Mentor integration', due: '2026-05-12', icon: <Clock size={20} /> },
  { id: 3, title: 'Submit weekly leaderboard scores', due: '2026-05-14', icon: <CheckCircle size={20} /> },
];

export default function UpcomingTasks() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200"
    >
      <h2 className="text-lg font-semibold mb-3">Upcoming Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-center gap-3">
            {t.icon}
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{t.title}</p>
              <p className="text-sm text-gray-500">Due {t.due}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
