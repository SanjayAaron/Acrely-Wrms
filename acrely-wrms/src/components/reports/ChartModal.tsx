import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * ChartModal Component
 * Reusable modal popup to show deep-dive drilldown details for KPI metrics, month trends, or warehouse breakdowns.
 */
export const ChartModal: React.FC<ChartModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4 pt-1">
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}

        <div className="max-h-[60vh] overflow-y-auto space-y-3">{children}</div>

        <div className="flex items-center justify-end pt-3 border-t border-[#E5E7EB]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
