import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'danger' | 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message = "Are you sure you want to move this item to the Recycle Bin?\n\nIt will remain in the Recycle Bin for 30 days.\nYou can restore it at any time before it is permanently deleted.",
  itemName,
  confirmText = "Move to Bin",
  cancelText = "Cancel",
  confirmVariant = "danger",
  icon = <Trash2 className="w-4 h-4" />
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-[12px] text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            {itemName && (
              <p className="font-semibold text-amber-950">
                Item: &quot;{itemName}&quot;
              </p>
            )}
            <p className="text-amber-800 whitespace-pre-line leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E7EB]">
          <Button variant="secondary" onClick={onClose} type="button">
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            type="button"
            icon={icon}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
