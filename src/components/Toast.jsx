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
    icon: <IoCheckmarkCircle className="w-5 h-5 text-emerald-600" />,
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10',
  },
  error: {
    icon: <IoCloseCircle className="w-5 h-5 text-red-600" />,
    border: 'border-red-500/20',
    bg: 'bg-red-500/10',
  },
  info: {
    icon: <IoInformationCircle className="w-5 h-5 text-[#0F4C5C]" />,
    border: 'border-[#0F4C5C]/20',
    bg: 'bg-[#0F4C5C]/10',
  },
};

function ToastItem({ toast, onClose }) {
  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-white border ${config.border} shadow-lg shadow-slate-200/50
                  animate-toast-in max-w-sm`}
      role="alert"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center`}>
        {config.icon}
      </div>
      <p className="text-sm text-slate-800 font-semibold flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 font-bold transition-colors flex-shrink-0 ml-2"
      >
        ×
      </button>
    </div>
  );
}
