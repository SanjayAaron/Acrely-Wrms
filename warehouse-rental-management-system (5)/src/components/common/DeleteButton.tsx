import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface DeleteButtonProps {
  onClick: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable DeleteButton component for moving items to Recycle Bin.
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  title = "Move to Recycle Bin",
  size = "sm",
  label = "Delete",
  className = "",
  disabled = false
}) => {
  return (
    <Button
      size={size}
      variant="danger"
      onClick={onClick}
      icon={<Trash2 className="w-3.5 h-3.5" />}
      title={title}
      className={className}
      disabled={disabled}
      type="button"
    >
      {label}
    </Button>
  );
};
