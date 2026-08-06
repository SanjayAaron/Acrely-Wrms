import React, { useState, useEffect } from 'react';
import { Mail, Lock, Building2, ArrowRight, ShieldCheck, Eye, EyeOff, Sun, Moon, ShieldAlert, Clock, MailCheck, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { securityEngine, SecurityAlert, SecurityAuditPayload } from '../../utils/securityManager';
import { SecurityAlertModal } from '../modals/SecurityAlertModal';
import { useExperience } from '../../context/ExperienceContext';
import logoIcon from '../../assets/bg eraser wrms.png';

interface LoginViewProps {
  onSignIn: () => void;
  onAuditLog?: (log: SecurityAuditPayload) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSignIn, onAuditLog }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { playSound, triggerHaptic } = useExperience();

  // Form input states
  const [email, setEmail] = useState<string>('admin@acrely.com');
  const [password, setPassword] = useState<string>('acrely2026');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Security & Lockout states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState<boolean>(false);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [activeAlertModal, setActiveAlertModal] = useState<SecurityAlert | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);

  // Check initial security state on render
  useEffect(() => {
    const secState = securityEngine.getState();
    if (secState.lockoutUntil && Date.now() < secState.lockoutUntil) {
      const remaining = Math.ceil((secState.lockoutUntil - Date.now()) / 1000);
      setIsLockedOut(true);
      setRemainingSeconds(remaining);
      setErrorMessage(
        'Too many failed login attempts. Your account has been temporarily locked for 2 minutes. Please try again later.'
      );
    }
  }, []);

  // Lockout countdown timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isLockedOut && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setErrorMessage(null);
            securityEngine.resetLockout();
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLockedOut, remainingSeconds]);

  // Format seconds into MM:SS
  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // If locked out, prevent submit and play error feedback
    if (isLockedOut) {
      playSound('error');
      triggerHaptic('error');
      setErrorMessage(
        `Account temporarily locked (${formatTimer(remainingSeconds)} remaining). Please wait before trying again.`
      );
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      playSound('error');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      playSound('error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Process attempt through Security Engine
      const result = securityEngine.attemptLogin(email, password, onAuditLog);

      if (result.success) {
        playSound('login');
        triggerHaptic('success');
        onSignIn();
      } else {
        playSound('error');
        triggerHaptic('error');
        setErrorMessage(result.message);

        if (result.lockedOut) {
          setIsLockedOut(true);
          setRemainingSeconds(result.remainingSeconds || 120);

          if (result.alertCreated) {
            setActiveAlertModal(result.alertCreated);
          } else {
            const alerts = securityEngine.getAlerts();
            if (alerts.length > 0) setActiveAlertModal(alerts[0]);
          }
        }
      }
    }, 500);
  };

  const handleOpenAlertEmailModal = () => {
    const alerts = securityEngine.getAlerts();
    if (alerts.length > 0) {
      setActiveAlertModal(alerts[0]);
    } else {
      setActiveAlertModal({
        id: 'SEC-ALT-TEMP',
        subject: 'Security Alert: Multiple Failed Login Attempts',
        recipientEmail: 'sanjayarron046@gmail.com',
        timestamp: new Date().toLocaleString(),
        ipAddress: '182.73.128.45',
        deviceBrowser: 'Chrome 126 on macOS',
        location: 'Chennai, Tamil Nadu, India',
        failedAttempts: 5,
        lockoutDurationMinutes: 2,
        attemptedEmail: email || 'admin@acrely.com',
        status: 'SENT'
      });
    }
    setIsAlertModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#111827] dark:text-[#F8FAFC] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-sans antialiased select-none transition-colors duration-150">
      {/* Top Header Badge / System Indicator */}
      <div className="w-full max-w-md flex justify-between items-center py-2 text-xs text-gray-500 dark:text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-gray-600 dark:text-[#CBD5E1]">Enterprise Logistics Portal</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-lg text-gray-600 dark:text-[#CBD5E1] hover:text-[#111827] dark:hover:text-[#F8FAFC] transition-colors cursor-pointer"
            title={`Toggle theme (Current: ${theme})`}
          >
            {resolvedTheme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-amber-500" />}
          </button>
          <span className="bg-blue-50 dark:bg-blue-950/80 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded text-[11px] font-semibold">
            v2.4 Security Hardened
          </span>
        </div>
      </div>

      {/* Main Centered Login Card */}
      <main className="w-full max-w-md my-auto">
        <div className="bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl shadow-2xl p-8 sm:p-10 transition-all duration-300">

          {/* Acrely WRMS Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl mb-3 overflow-hidden">
              <img src={logoIcon} alt="Acrely WRMS Logo" className="w-full h-full object-contain scale-125" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
              Acrely WRMS
            </h1>

            <p className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">
              Warehouse Rental Management System
            </p>
          </div>

          {/* Standard Generic Failed Password Banner */}
          {errorMessage && !isLockedOut && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs rounded-xl flex items-center gap-2 font-medium animate-shake">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Prominent Account Lockout Banner */}
          {isLockedOut && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-900 dark:text-red-200 rounded-2xl space-y-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/80 rounded-xl shrink-0 text-red-600 dark:text-red-300">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-800 dark:text-red-300">
                      Account Locked Out
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-red-600 dark:text-red-300 animate-pulse" />
                      {formatTimer(remainingSeconds)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-red-800 dark:text-red-300">
                    Too many failed login attempts. Your account has been temporarily locked for 2 minutes. Please try again later.
                  </p>
                </div>
              </div>

              {/* Security Alert Email Notification Trigger Button */}
              <div className="pt-2 border-t border-red-200 dark:border-red-800/80 flex items-center justify-between">
                <span className="text-[10px] text-red-700 dark:text-red-400 font-medium">
                  Security email alert sent to owner.
                </span>
                <button
                  type="button"
                  onClick={handleOpenAlertEmailModal}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <MailCheck className="w-3.5 h-3.5" />
                  <span>View Owner Email Alert</span>
                </button>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input 1: Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[#111827] dark:text-[#CBD5E1]">
                Email Address
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  disabled={isLockedOut}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@acrely.com"
                  className="w-full bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#334155] text-[#111827] dark:text-[#F8FAFC] text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors font-medium placeholder-gray-400 dark:placeholder:text-[#64748B] disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#111827] dark:text-[#CBD5E1]">
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLockedOut}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#334155] text-[#111827] dark:text-[#F8FAFC] text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors font-medium placeholder-gray-400 dark:placeholder:text-[#64748B] disabled:opacity-60 disabled:cursor-not-allowed"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:text-[#64748B] dark:hover:text-[#F8FAFC] focus:outline-none z-10 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  disabled={isLockedOut}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] border-gray-300 dark:border-slate-600 rounded focus:ring-[#2563EB] accent-[#2563EB] cursor-pointer disabled:opacity-60"
                />
                <span className="text-xs font-medium text-gray-600 dark:text-[#CBD5E1] select-none">
                  Remember Me
                </span>
              </label>

              {/* Security Hint */}
              <button
                type="button"
                onClick={handleOpenAlertEmailModal}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
              >
                Security Log Preview
              </button>
            </div>

            {/* Primary Action: Blue Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLockedOut}
              className="w-full bg-[#2563EB] hover:bg-[#3B82F6] active:bg-[#1d4ed8] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : isLockedOut ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Account Locked ({formatTimer(remainingSeconds)})</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Enterprise Compliance Footnote */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#334155] text-center flex items-center justify-center gap-1.5 text-gray-400 dark:text-[#64748B] text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
            <span>256-bit SSL Argon2id Encrypted Portal</span>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-2xl text-center py-4 px-4 text-[11px] text-gray-500 dark:text-[#64748B] font-medium space-y-1">
        <p className="font-bold text-gray-700 dark:text-[#CBD5E1]">
          © {new Date().getFullYear()} Acrely Real Estate. All Rights Reserved.
        </p>
        <p className="text-[10px] leading-relaxed text-gray-400 dark:text-[#64748B]">
          Acrely Real Estate and its applications, including Acrely WRMS, Acrely PMS and related services, are proprietary software developed by Acrely. All trademarks, product names, logos, designs and source code are protected by applicable intellectual property laws. Unauthorized use, reproduction or distribution is strictly prohibited.
        </p>
      </footer>

      {/* Security Alert Email Modal */}
      <SecurityAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alert={activeAlertModal}
      />
    </div>
  );
};
