import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileErrorBannerProps {
  message: string;
  onClear: () => void;
}

export const FileErrorBanner: React.FC<FileErrorBannerProps> = ({ message, onClear }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 bg-error-container text-on-error-container rounded-2xl flex items-center justify-between shadow-editorial max-w-2xl mx-auto mb-6 border border-error/20"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <AlertCircle size={20} className="text-error shrink-0" />
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClear}
        className="text-on-error-container/60 hover:text-error hover:bg-error-container/80 transition-colors p-1.5 rounded-lg"
        aria-label="Cerrar advertencia"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
