import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';

const badges = [
  { id: 1, name: 'First Submission', icon: <Award size={24} className="text-yellow-500" /> },
  { id: 2, name: 'Top 10%', icon: <Star size={24} className="text-purple-500" /> },
  { id: 3, name: 'AI Mentor Fan', icon: <Award size={24} className="text-indigo-500" /> },
];

export default function AchievementBadges() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200"
    >
      <h2 className="text-lg font-semibold mb-3">Achievement Badges</h2>
      <div className="flex gap-4">
        {badges.map((b) => (
          <div key={b.id} className="flex flex-col items-center">
            {b.icon}
            <span className="text-sm mt-1 text-gray-700">{b.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
