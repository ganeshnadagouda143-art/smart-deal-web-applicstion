import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useSmartDeal } from '../contexts/SmartDealContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useSmartDeal();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0 pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const Icon =
          toast.variant === 'error'
            ? AlertCircle
            : toast.variant === 'info'
            ? Info
            : CheckCircle2;

        const iconColor =
          toast.variant === 'error'
            ? 'text-red-600'
            : toast.variant === 'info'
            ? 'text-[#2563EB]'
            : 'text-[#10B981]';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 bg-white border border-[#E2E8F0] rounded-xl p-3.5 shadow-lg transition-all duration-150"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1E293B]">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#64748B] hover:text-[#1E293B] p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
