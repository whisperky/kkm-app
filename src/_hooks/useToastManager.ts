import { useState, useEffect } from "react";
import { toast as hotToast, ToastOptions } from "react-hot-toast";

interface ManagedToast {
  id: string;
  message: string;
}

const useToastManager = (limit: number) => {
  const [toasts, setToasts] = useState<ManagedToast[]>([]);

  useEffect(() => {
    if (toasts.length > limit) {
      const excess = toasts.length - limit;
      toasts.slice(0, excess).forEach((t) => hotToast.dismiss(t.id));
      setToasts((prev) => prev.slice(excess));
    }
  }, [toasts, limit]);

  const toast = (message: string, options?: ToastOptions) => {
    const id = hotToast(message, options);
    setToasts((prev) => [...prev, { id, message }]);
  };

  toast.success = (message: string, options?: ToastOptions) => {
    const id = hotToast.success(message, options);
    setToasts((prev) => [...prev, { id, message }]);
  };

  toast.error = (message: string, options?: ToastOptions) => {
    const id = hotToast.error(message, options);
    setToasts((prev) => [...prev, { id, message }]);
  };

  toast.loading = (message: string, options?: ToastOptions) => {
    const id = hotToast.loading(message, options);
    setToasts((prev) => [...prev, { id, message }]);
  };

  return { toast };
};

export default useToastManager;
