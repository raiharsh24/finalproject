import React, { useState } from 'react';
import ProblemCard from '../components/ProblemCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { problems as initialProblems } from '../data/problems';
import { Plus } from 'lucide-react';
import { toast } from '../components/Toast';

export default function ProblemsBank() {
  const [problems, setProblems] = useState(initialProblems);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editProblem, setEditProblem] = useState(null);
  const [form, setForm] = useState({ title: '', subject: '', difficulty: 'Easy', description: '' });

  const filtered = problems.filter((p) => filter === 'All' || p.subject === filter);

  const openCreate = () => {
    setEditProblem(null);
    setForm({ title: '', subject: '', difficulty: 'Easy', description: '' });
    setModalOpen(true);
  };

  const openEdit = (problem) => {
    setEditProblem(problem);
    setForm({ ...problem });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editProblem) {
      setProblems((prev) => prev.map((p) => (p.id === editProblem.id ? { ...form, id: editProblem.id } : p)));
      toast('Problem updated');
    } else {
      const newProblem = { ...form, id: Date.now() };
      setProblems((prev) => [...prev, newProblem]);
      toast('Problem added');
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
    toast('Problem deleted');
  };

  const subjects = ['All', 'Math', 'Physics', 'Biology', 'CS', 'History'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Problems Bank</h1>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-1" /> Add Problem
        </Button>
      </div>
      {/* Filter row */}
      <div className="flex space-x-2 mb-4">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setFilter(sub)}
            className={`px-3 py-1 rounded ${filter === sub ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {sub}
          </button>
        ))}
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <ProblemCard key={p.id} problem={p} onEdit={() => openEdit(p)} onDelete={handleDelete} />
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">{editProblem ? 'Edit Problem' : 'Add Problem'}</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded p-2" />
          <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="border rounded p-2" />
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="border rounded p-2">
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded p-2 col-span-2" rows={4} />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
