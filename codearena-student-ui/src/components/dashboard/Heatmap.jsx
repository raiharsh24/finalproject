import { motion } from 'framer-motion';

// Generate mock heatmap data for the past 30 days
const days = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const count = Math.floor(Math.random() * 5); // 0-4 submissions per day
  return { date: date.toISOString().split('T')[0], count };
}).reverse();

function getColor(count) {
  const shades = ['bg-gray-200', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'];
  return shades[count];
}

export default function Heatmap() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200"
    >
      <h2 className="text-lg font-semibold mb-3">Activity Heatmap</h2>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => (
          <div
            key={d.date}
            className={`w-4 h-4 rounded ${getColor(d.count)} transition-colors`}
            title={`${d.date}: ${d.count} submissions`}
          />
        ))}
      </div>
    </motion.div>
  );
}
