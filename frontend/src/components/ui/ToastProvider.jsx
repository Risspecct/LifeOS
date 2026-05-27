import { createContext, useCallback, useContext, useState, useEffect } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-0 right-0 sm:bottom-md sm:right-md p-md z-[200] flex flex-col gap-sm pointer-events-none max-w-full sm:max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-sm rounded-xl shadow-lg border animate-in slide-in-from-bottom-5 fade-in duration-300 ${
              toast.type === "success"
                ? "bg-surface-container border-primary/30 text-on-surface"
                : toast.type === "error"
                ? "bg-error/10 border-error/30 text-error"
                : "bg-surface border-outline-variant text-on-surface"
            }`}
          >
            <div className="flex items-center gap-sm">
              <span className={`material-symbols-outlined text-[20px] ${
                toast.type === "success" ? "text-primary" : toast.type === "error" ? "text-error" : "text-on-surface-variant"
              }`}>
                {toast.type === "success" ? "check_circle" : toast.type === "error" ? "error" : "info"}
              </span>
              <span className="font-label-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-surface-container rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
