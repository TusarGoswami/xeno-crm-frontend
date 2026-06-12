import { createContext, useContext, useState, useCallback } from 'react';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle } from 'react-icons/io5';

/**
 * Toast Notification System
 * Provides a context + hook for showing toast notifications from anywhere.
 *
 * Usage:
 *   const { showToast } = useToast();
 *   showToast('Campaign launched!', 'success');
 */

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const typeConfig = {
  success: {
    icon: <IoCheckmarkCircle className="w-5 h-5 text-emerald-400" />,
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
  error: {
    icon: <IoCloseCircle className="w-5 h-5 text-red-400" />,
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
  },
  info: {
    icon: <IoInformationCircle className="w-5 h-5 text-brand-400" />,
    border: 'border-brand-500/30',
    bg: 'bg-brand-500/10',
  },
};

function ToastItem({ toast, onClose }) {
  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
                  glass border ${config.border} shadow-xl shadow-black/20
                  animate-toast-in max-w-sm`}
      role="alert"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
        {config.icon}
      </div>
      <p className="text-sm text-gray-200 flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
      >
        ×
      </button>
    </div>
  );
}
