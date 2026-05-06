import React, { useState } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import { toast } from '../components/Toast';
import { Plus } from 'lucide-react';

// Simple week view data structure
const initialClasses = [
  { id: 1, subject: 'Math Class', day: 'Mon', start: '09:00', end: '10:00', color: 'bg-blue-500' },
  { id: 2, subject: 'Physics Lab', day: 'Tue', start: '11:00', end: '12:00', color: 'bg-green-500' },
  { id: 3, subject: 'Biology', day: 'Wed', start: '09:00', end: '10:00', color: 'bg-purple-500' },
  { id: 4, subject: 'CS Workshop', day: 'Thu', start: '14:00', end: '15:00', color: 'bg-orange-500' },
  { id: 5, subject: 'History Review', day: 'Fri', start: '10:00', end: '11:00', color: 'bg-red-500' },
];

const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const hours = Array.from({length: 10}, (_,i)=>8+i); // 8am-17pm

export default function Schedule() {
  const [classes, setClasses] = useState(initialClasses);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ subject:'', day:'Mon', start:'09:00', end:'10:00', color:'bg-blue-500' });

  const openModal = () => setModalOpen(true);
  const handleSave = () => {
    const newClass = { ...form, id: Date.now() };
    setClasses((prev)=>[...prev,newClass]);
    setModalOpen(false);
    toast('Class added');
  };

  const getCellClasses = (day,hour)=>{
    const startStr = `${hour.toString().padStart(2,'0')}:00`;
    const cls = classes.find(c=>c.day===day && c.start===startStr);
    if(cls){
      const span = (parseInt(cls.end) - parseInt(cls.start));
      return (
        <div className={`${cls.color} text-white p-1 rounded absolute inset-0`} style={{height:`${span*100}%`}}>
          {cls.subject}<br/>{cls.start}-{cls.end}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Schedule</h1>
        <Button variant="primary" onClick={openModal}><Plus className="w-4 h-4 mr-1"/>Add Class</Button>
      </div>
      <div className="overflow-auto">
        <table className="border-collapse w-full min-w-max">
          <thead>
            <tr>
              <th className="border border-gray-300 w-16" />
              {days.map(d=> <th key={d} className="border border-gray-300 text-center py-1">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {hours.map(h=> (
              <tr key={h} className="relative" style={{height:'40px'}}>
                <td className="border border-gray-300 text-center text-sm">{h}:00</td>
                {days.map(d=> (
                  <td key={d} className="border border-gray-300 relative">
                    {getCellClasses(d,h)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={()=>setModalOpen(false)}>
        <h2 className="text-xl font-semibold mb-4">Add Class</h2>
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Subject" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} className="border rounded p-2" />
          <select value={form.day} onChange={e=>setForm({...form,day:e.target.value})} className="border rounded p-2">
            {days.map(d=> <option key={d}>{d}</option>)}
          </select>
          <input type="time" value={form.start} onChange={e=>setForm({...form,start:e.target.value})} className="border rounded p-2" />
          <input type="time" value={form.end} onChange={e=>setForm({...form,end:e.target.value})} className="border rounded p-2" />
          <select value={form.color} onChange={e=>setForm({...form,color:e.target.value})} className="border rounded p-2 col-span-2">
            <option value="bg-blue-500">Blue</option>
            <option value="bg-green-500">Green</option>
            <option value="bg-purple-500">Purple</option>
            <option value="bg-orange-500">Orange</option>
            <option value="bg-red-500">Red</option>
          </select>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <Button variant="secondary" onClick={()=>setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </div>
  );
}
