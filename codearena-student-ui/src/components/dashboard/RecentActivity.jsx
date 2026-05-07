import { motion } from 'framer-motion';
import { Code, CheckCircle, XCircle } from 'lucide-react';

const activities = [
  { id: 1, type: 'submission', desc: 'Submitted solution for Binary Search Trees', status: 'passed' },
  { id: 2, type: 'hint', desc: 'Requested hint for Dynamic Programming: Knapsack', status: 'provided' },
  { id: 3, type: 'submission', desc: 'Submitted solution for Graph Traversal', status: 'failed' },
];

function getIcon(type) {
  switch (type) {
    case 'submission':
      return <Code size={20} className="text-blue-600" />;
    case 'hint':
      return <CheckCircle size={20} className="text-green-600" />;
    default:
      return <XCircle size={20} className="text-gray-600" />;
  }
}

export default function RecentActivity() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200"
    >
      <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
      <ul className="space-y-2">
        {activities.map((a) => (
          <li key={a.id} className="flex items-center gap-3">
            {getIcon(a.type)}
            <p className="text-gray-800">{a.desc}</p>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
