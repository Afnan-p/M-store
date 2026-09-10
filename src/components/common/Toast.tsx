import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#151518] border border-[#27272A] rounded-xl shadow-2xl animate-in slide-in-from-bottom-5">
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 text-[#E50914] shrink-0" />}
      {type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
      
      <span className="text-sm font-medium text-white">{message}</span>
      
      <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-md">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
