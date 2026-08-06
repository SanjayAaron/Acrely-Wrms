import React, { useState } from 'react';
import { Eye, EyeOff, Check, X, ShieldAlert } from 'lucide-react';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  showStrengthMeter?: boolean;
  confirmValue?: string;
  errorMessage?: string;
  helperText?: string;
  id?: string;
}

/**
 * Reusable Password Input Component
 * Includes Eye/EyeOff toggle buttons, password strength calculation meter,
 * and real-time password matching validation.
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '••••••••',
  required = false,
  showStrengthMeter = false,
  confirmValue,
  errorMessage,
  helperText,
  id
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Toggle password visibility
  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Calculate Password Strength Score (0 to 100)
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-gray-200', text: 'text-gray-400' };

    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 12) score += 15;
    if (/[A-Z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 20;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;

    if (score < 40) return { score, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-600' };
    if (score < 75) return { score, label: 'Medium', color: 'bg-amber-500', text: 'text-amber-600' };
    return { score, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getPasswordStrength(value);

  // Check if confirmation password matches
  const isMatchError = confirmValue !== undefined && confirmValue !== '' && value !== confirmValue;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-xs font-semibold text-[#111827] dark:text-[#CBD5E1]">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {showStrengthMeter && value && (
          <span className={`text-[11px] font-bold ${strength.text}`}>
            {strength.label} Password
          </span>
        )}
      </div>

      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full px-3 py-2 pr-10 border rounded-[8px] text-xs text-[#111827] dark:text-[#F8FAFC] bg-white dark:bg-[#1E293B] focus:outline-none focus:ring-2 transition-all ${
            isMatchError || errorMessage
              ? 'border-rose-300 dark:border-rose-500 focus:border-rose-500 focus:ring-rose-200'
              : 'border-[#E5E7EB] dark:border-[#334155] focus:border-[#2563EB] focus:ring-[#2563EB]/20'
          }`}
        />

        {/* Eye / EyeOff Toggle Button */}
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-2.5 text-gray-400 dark:text-[#64748B] hover:text-gray-600 dark:hover:text-[#F8FAFC] focus:outline-none cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 text-[#2563EB] dark:text-blue-400" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Strength Bar Indicator */}
      {showStrengthMeter && value && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      )}

      {/* Helper / Error Text */}
      {isMatchError && (
        <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1 mt-1">
          <ShieldAlert className="w-3 h-3" /> Passwords do not match.
        </p>
      )}

      {errorMessage && !isMatchError && (
        <p className="text-[11px] text-rose-600 font-medium">{errorMessage}</p>
      )}

      {helperText && !isMatchError && !errorMessage && (
        <p className="text-[11px] text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
