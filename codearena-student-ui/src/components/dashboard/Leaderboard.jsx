import { motion } from 'framer-motion';

// Mock leaderboard data
const users = [
  { id: 1, name: 'You', xp: 980, avatar: 'https://i.pravatar.cc/40?img=1', current: true },
  { id: 2, name: 'Shivani', xp: 920, avatar: 'https://i.pravatar.cc/40?img=2' },
  { id: 3, name: 'Priya Singh', xp: 870, avatar: 'https://i.pravatar.cc/40?img=3' },
];

export default function Leaderboard() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200"
    >
      <h2 className="text-lg font-semibold mb-3">Weekly Leaderboard</h2>
      <ul className="space-y-2">
        {users.map((u) => (
          <li
            key={u.id}
            className={`flex items-center gap-3 p-2 rounded ${u.current ? 'bg-purple-100' : ''}`}
          >
            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{u.name}</p>
            </div>
            <span className="text-sm font-medium text-gray-600">{u.xp} XP</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
