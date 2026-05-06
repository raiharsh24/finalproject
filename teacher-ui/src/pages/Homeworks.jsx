import React, { useState } from 'react';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { homeworks as initialHomeworks } from '../data/homeworks';
import { Plus } from 'lucide-react';
import { toast } from '../components/Toast';

export default function Homeworks() {
  const [assignments, setAssignments] = useState(initialHomeworks);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', class: '', given: '', due: '' });

  const openModal = () => {
    setForm({ title: '', class: '', given: '', due: '' });
    setModalOpen(true);
  };

  const handleSave = () => {
    const newAssign = { ...form, id: Date.now(), submitted: '0/0', status: 'Pending' };
    setAssignments((prev) => [...prev, newAssign]);
    setModalOpen(false);
    toast('Assignment created');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Homeworks</h1>
        <Button variant="primary" onClick={openModal}>
          <Plus className="w-4 h-4 mr-1" /> Create Assignment
        </Button>
      </div>
      <table className="min-w-full table-auto bg-card-bg rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Assignment Title</th>
            <th className="px-4 py-2 text-left">Class</th>
            <th className="px-4 py-2 text-left">Given Date</th>
            <th className="px-4 py-2 text-left">Due Date</th>
            <th className="px-4 py-2 text-left">Submitted</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id} className="border-b hover:bg-purple-50">
              <td className="px-4 py-2">{a.title}</td>
              <td className="px-4 py-2">{a.class}</td>
              <td className="px-4 py-2">{a.given}</td>
              <td className="px-4 py-2">{a.due}</td>
              <td className="px-4 py-2">{a.submitted}</td>
              <td className="px-4 py-2">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Create Assignment</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded p-2" />
          <input placeholder="Class" value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="border rounded p-2" />
          <input type="date" placeholder="Given Date" value={form.given} onChange={(e) => setForm({ ...form, given: e.target.value })} className="border rounded p-2" />
          <input type="date" placeholder="Due Date" value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} className="border rounded p-2" />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
