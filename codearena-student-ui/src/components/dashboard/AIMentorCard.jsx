import { motion } from 'framer-motion';

export default function AIMentorCard() {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl shadow-xl"
    >
      <h2 className="text-xl font-bold mb-2">AI Mentor</h2>
      <p className="mb-4">Your personal coding assistant. Ask questions, get hints, and improve faster.</p>
      <button className="bg-white text-purple-700 font-medium px-5 py-2 rounded-full hover:bg-gray-100 transition-colors">
        Ask a Question
      </button>
    </motion.div>
  );
}
