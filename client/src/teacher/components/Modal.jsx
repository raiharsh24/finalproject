import React, {
  useEffect,
  useState,
} from "react";

export default function Modal({
  isOpen,
  onClose,
  children,
}) {
  const [visible,
    setVisible] =
    useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey =
      (e) => {
        if (
          e.key ===
          "Escape"
        ) {
          onClose();
        }
      };

    if (isOpen) {
      document.addEventListener(
        "keydown",
        handleKey
      );
    }

    return () =>
      document.removeEventListener(
        "keydown",
        handleKey
      );
  }, [isOpen, onClose]);

  if (
    !isOpen &&
    !visible
  )
    return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >

      {/* BACKDROP */}

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* MODAL */}

      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className={`
          relative
          bg-white
          rounded-2xl
          shadow-2xl
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          p-6
          transition-all
          duration-200
          ${
            visible
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }
        `}
      >
        {children}
      </div>

    </div>
  );
}