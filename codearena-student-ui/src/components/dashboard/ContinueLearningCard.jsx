import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

// Mock data for a learning course
const course = {
  title: 'Advanced Algorithms',
  progress: 0.62, // 62%
  thumbnail: 'https://picsum.photos/seed/algorithms/400/200',
};

export default function ContinueLearningCard() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-4 bg-white/70 backdrop-blur rounded-3xl shadow-xl border border-slate-200"
    >
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full lg:w-48 h-28 object-cover rounded-lg shadow"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{course.title}</h3>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-purple-600 h-2.5 rounded-full"
              style={{ width: `${course.progress * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">{Math.round(course.progress * 100)}% completed</p>
        </div>
        <button className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-lg transition-colors">
          <Play size={16} />
          Resume
        </button>
      </div>
    </motion.div>
  );
}
