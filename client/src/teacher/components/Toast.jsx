import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

let toastId = 0;
const listeners = [];
export function toast(message) {
  const id = ++toastId;
  listeners.forEach((cb) => cb({ id, message }));
  setTimeout(() => {
    listeners.forEach((cb) => cb({ id, dismiss: true }));
  }, 3000);
  return id;
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const handler = (event) => {
      if (event.dismiss) {
        setToasts((prev) => prev.filter((t) => t.id !== event.id));
      } else {
        setToasts((prev) => [...prev, event]);
      }
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-gray-800 text-white px-4 py-2 rounded shadow-lg flex items-center justify-between min-w-[200px]"
        >
          <span>{t.message}</span>
          <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
