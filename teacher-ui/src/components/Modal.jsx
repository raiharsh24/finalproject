import React, { useEffect, useState } from 'react';

/**
 * Modal component with smooth open/close animation.
 * The component always calls its hooks unconditionally to satisfy React's rules of hooks.
 */
export default function Modal({ isOpen, onClose, children }) {
  // State used for animation trigger
  const [visible, setVisible] = useState(false);

  // When isOpen changes, we toggle visibility after a tick to allow CSS transition
  useEffect(() => {
    if (isOpen) {
      // allow component to mount before starting animation
      setVisible(true);
    } else {
      // start closing animation then hide after transition duration (200ms)
      setVisible(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
    }
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // If the modal is not open and the closing animation has finished, render nothing
  if (!isOpen && !visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={onClose}>
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
      {/* Modal content */}
      <div
        className={`relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 transform transition-all duration-200 ${
          visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
