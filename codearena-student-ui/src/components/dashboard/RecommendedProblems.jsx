import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const problems = [
  { id: 1, title: 'Binary Search Trees', difficulty: 'Medium' },
  { id: 2, title: 'Dynamic Programming: Knapsack', difficulty: 'Hard' },
  { id: 3, title: 'Graph Traversal', difficulty: 'Easy' },
];

export default function RecommendedProblems() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200"
    >
      <h2 className="text-lg font-semibold mb-3">Recommended Problems</h2>
      <ul className="space-y-2">
        {problems.map((p) => (
          <li key={p.id} className="flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-800">{p.title}</p>
              <p className="text-sm text-gray-500">{p.difficulty}</p>
            </div>
            <button className="text-sm text-purple-600 hover:underline">Start</button>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
