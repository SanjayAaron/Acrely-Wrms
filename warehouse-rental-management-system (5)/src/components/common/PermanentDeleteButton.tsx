import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface PermanentDeleteButtonProps {
  onClick: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable PermanentDeleteButton component for removing soft-deleted items permanently.
 */
export const PermanentDeleteButton: React.FC<PermanentDeleteButtonProps> = ({
  onClick,
  title = "Delete Permanently",
  size = "sm",
  label = "Delete Permanently",
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
