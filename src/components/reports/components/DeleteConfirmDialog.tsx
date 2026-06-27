// ==================== REPORTS MODULE - DELETE CONFIRMATION DIALOG ====================
import React from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  itemName?: string;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="rounded-2xl w-full max-w-md overflow-hidden flex flex-col animate-fadeIn"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3), 0 2px 8px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-red-300"
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                boxShadow: "0 4px 12px 0 rgba(239, 68, 68, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              {itemName && (
                <p className="text-sm text-white/50 truncate max-w-[250px]">{itemName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm leading-relaxed">
                {description || `Are you sure you want to delete this item? This action cannot be undone.`}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/60 hover:text-white transition rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded-lg font-medium transition text-white"
            style={{
              background: "rgba(239, 68, 68, 0.2)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              boxShadow: "0 4px 12px 0 rgba(239, 68, 68, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.45)';
              e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(239, 68, 68, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
              e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(239, 68, 68, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;















