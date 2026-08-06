import React from 'react';
import { StaffMember } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ShieldAlert, UserX, UserCheck } from 'lucide-react';

interface DisableAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onConfirmToggle: (staff: StaffMember) => void;
}

/**
 * DisableAccountDialog Component
 * Confirmation dialog for suspending or reactivating a staff account.
 * Reassures the user that the account can be re-enabled later.
 */
export const DisableAccountDialog: React.FC<DisableAccountDialogProps> = ({
  isOpen,
  onClose,
  staff,
  onConfirmToggle
}) => {
  if (!staff) return null;

  const isDisabling = staff.status === 'Active';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isDisabling ? 'Disable Staff Account' : 'Enable Staff Account'}
      description={`Update account status for ${staff.firstName} ${staff.lastName}`}
      maxWidth="sm"
    >
      <div className="space-y-4 text-xs text-[#111827] dark:text-[#F8FAFC]">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-[10px] flex items-start gap-2 text-amber-800 dark:text-amber-300">
          <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              {isDisabling
                ? 'Are you sure you want to disable this staff login?'
                : 'Reactivate staff member account?'}
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
              {isDisabling
                ? 'The staff member will be immediately logged out and blocked from accessing the system. You can easily re-enable their account at any time later.'
                : 'The staff member will regain access to their assigned modules and features.'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#334155]">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={isDisabling ? 'danger' : 'primary'}
            icon={
              isDisabling ? (
                <UserX className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )
            }
            onClick={() => {
              onConfirmToggle(staff);
              onClose();
            }}
          >
            {isDisabling ? 'Disable Account' : 'Enable Account'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
