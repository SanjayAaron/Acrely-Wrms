import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface RestoreButtonProps {
  onClick: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable RestoreButton component for restoring soft-deleted items.
 */
export const RestoreButton: React.FC<RestoreButtonProps> = ({
  onClick,
  title = "Restore item to original location",
  size = "sm",
  label = "Restore",
  className = "",
  disabled = false
}) => {
  return (
    <Button
      size={size}
      variant="outline"
      onClick={onClick}
      icon={<RotateCcw className="w-3.5 h-3.5 text-[#2563EB]" />}
      title={title}
      className={`hover:bg-blue-50 text-[#2563EB] border-blue-200 ${className}`}
      disabled={disabled}
      type="button"
    >
      {label}
    </Button>
  );
};
