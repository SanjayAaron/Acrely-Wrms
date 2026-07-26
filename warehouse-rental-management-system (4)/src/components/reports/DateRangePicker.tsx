import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

/**
 * DateRangePicker Component
 * Modal dialog that allows selecting custom start and end dates with Apply and Cancel actions.
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isOpen,
  onClose,
  onApply,
  initialStartDate = '',
  initialEndDate = ''
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [error, setError] = useState('');

  const handleApply = () => {
    if (!startDate || !endDate) {
      setError('Please select both Start Date and End Date.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start Date cannot be later than End Date.');
      return;
    }

    setError('');
    onApply(startDate, endDate);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Custom Date Range Selector" maxWidth="sm">
      <div className="space-y-4 pt-1">
        <p className="text-xs text-gray-500">
          Specify custom start and end dates to filter financial reports, occupancy records, and commission settlements.
        </p>

        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-[8px] text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setError('');
                }}
                className="w-full p-2 border border-[#E5E7EB] rounded-[8px] text-xs font-medium focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 block">End Date</label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setError('');
                }}
                className="w-full p-2 border border-[#E5E7EB] rounded-[8px] text-xs font-medium focus:border-[#2563EB] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleApply}>
            Apply Filter
          </Button>
        </div>
      </div>
    </Modal>
  );
};
