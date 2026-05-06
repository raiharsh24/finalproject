import React, { useState } from 'react';
import QuizTable from '../components/QuizTable';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { quizzes as initialQuizzes } from '../data/quizzes';
import { Plus } from 'lucide-react';

export default function QuizManagement() {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [form, setForm] = useState({ title: '', subject: '', questions: '', timeLimit: '', dueDate: '', status: 'Draft' });

  const filtered = quizzes.filter((q) => filter === 'All' || q.status === filter);

  const openCreate = () => {
    setEditQuiz(null);
    setForm({ title: '', subject: '', questions: '', timeLimit: '', dueDate: '', status: 'Draft' });
    setModalOpen(true);
  };

  const openEdit = (quiz) => {
    setEditQuiz(quiz);
    setForm({ ...quiz });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editQuiz) {
      setQuizzes((prev) => prev.map((q) => (q.id === editQuiz.id ? { ...form, id: editQuiz.id } : q)));
    } else {
      const newQuiz = { ...form, id: Date.now() };
      setQuizzes((prev) => [...prev, newQuiz]);
    }
    setModalOpen(false);
    // TODO: toast notification
  };

  const handleDelete = (id) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    // TODO: toast
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quiz Management</h1>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" /> Create New Quiz
        </Button>
      </div>
      {/* Filter tabs */}
      <div className="flex space-x-4">
        {['All', 'Active', 'Draft', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded ${filter === tab ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'} `}
          >
            {tab}
          </button>
        ))}
      </div>
      <QuizTable quizzes={filtered} onEdit={openEdit} onDelete={handleDelete} />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">{editQuiz ? 'Edit Quiz' : 'Create Quiz'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded p-2" />
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="border rounded p-2" />
          <input placeholder="Questions" value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} className="border rounded p-2" />
          <input placeholder="Time Limit" value={form.timeLimit} onChange={(e) => setForm({ ...form, timeLimit: e.target.value })} className="border rounded p-2" />
          <input placeholder="Due Date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="border rounded p-2" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="border rounded p-2">
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save Quiz</Button>
        </div>
      </Modal>
    </div>
  );
}
