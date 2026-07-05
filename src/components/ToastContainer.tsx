import React, { useEffect } from "react";
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X 
} from "lucide-react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}

export default function ToastContainer({ toasts, setToasts }: ToastContainerProps) {
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
  key?: string | number;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const { id, message, type, duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Styling maps based on type
  const typeConfig = {
    success: {
      bg: "bg-emerald-950/90 border-emerald-500/30 text-emerald-200",
      iconColor: "text-emerald-400",
      icon: CheckCircle,
      shadow: "shadow-[0_4px_20px_rgba(16,185,129,0.15)]",
      barBg: "bg-emerald-500"
    },
    error: {
      bg: "bg-rose-950/90 border-rose-500/30 text-rose-200",
      iconColor: "text-rose-400",
      icon: AlertCircle,
      shadow: "shadow-[0_4px_20px_rgba(244,63,94,0.15)]",
      barBg: "bg-rose-500"
    },
    warning: {
      bg: "bg-amber-950/90 border-amber-500/30 text-amber-200",
      iconColor: "text-amber-400",
      icon: AlertTriangle,
      shadow: "shadow-[0_4px_20px_rgba(245,158,11,0.15)]",
      barBg: "bg-amber-500"
    },
    info: {
      bg: "bg-slate-900/95 border-indigo-500/30 text-slate-100",
      iconColor: "text-indigo-400",
      icon: Info,
      shadow: "shadow-[0_4px_20px_rgba(99,102,241,0.15)]",
      barBg: "bg-indigo-500"
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div 
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-md ${config.bg} ${config.shadow} transition-all duration-300 animate-slide-in relative overflow-hidden`}
      role="alert"
    >
      {/* Decorative colored left strip or bottom loader animation */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${config.barBg} animate-toast-progress`} style={{ animationDuration: `${duration}ms` }} />

      <div className={`p-1 bg-white/5 rounded-lg shrink-0 ${config.iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 pr-4">
        <p className="text-xs font-medium leading-relaxed">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
