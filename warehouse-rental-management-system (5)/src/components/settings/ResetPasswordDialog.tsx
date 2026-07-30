import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { PasswordInput } from './PasswordInput';
import { KeyRound, Wand2, Copy, Check, ShieldAlert } from 'lucide-react';

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onConfirmReset: (staffId: string, newPassword: string) => void;
}

/**
 * ResetPasswordDialog Component
 * Allows resetting staff login password.
 * Includes "Generate Strong Password" random generator, "Copy Password" to clipboard,
 * Eye/EyeOff toggle buttons, and match validation.
 */
export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  isOpen,
  onClose,
  staff,
  onConfirmReset
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!staff) return null;

  // Helper to generate strong random 12-character password
  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let generated = '';
    for (let i = 0; i < 12; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(generated);
    setConfirmPassword(generated);
    setErrorMsg('');
  };

  // Helper to copy password to clipboard
  const handleCopyPassword = () => {
    if (!newPassword) return;
    navigator.clipboard.writeText(newPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      setErrorMsg('Please enter or generate a new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    onConfirmReset(staff.id, newPassword);
    setNewPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Staff Password"
      description={`Update credentials for ${staff.firstName} ${staff.lastName} (${staff.email})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-[8px] text-xs text-rose-700 dark:text-rose-400 flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-[10px] text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Click below to automatically generate a secure password.</span>
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            icon={<Wand2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />}
            onClick={handleGeneratePassword}
            className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-900 dark:text-amber-200 cursor-pointer shrink-0"
          >
            Generate Password
          </Button>
        </div>

        <PasswordInput
          label="New Password"
          value={newPassword}
          onChange={setNewPassword}
          showStrengthMeter={true}
          required
        />

        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          confirmValue={newPassword}
          required
        />

        {/* Copy Password Button */}
        {newPassword && (
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-[8px] text-xs">
            <span className="font-mono text-gray-700 dark:text-[#F8FAFC] select-all font-semibold">
              {newPassword}
            </span>
            <button
              type="button"
              onClick={handleCopyPassword}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#273549] border border-[#E5E7EB] dark:border-[#334155] rounded-md hover:bg-slate-100 dark:hover:bg-[#334155] text-[#2563EB] dark:text-blue-400 font-semibold cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Password</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#334155]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save New Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};
