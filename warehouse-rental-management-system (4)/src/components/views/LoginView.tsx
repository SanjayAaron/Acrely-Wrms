import React, { useState } from 'react';
import { Mail, Lock, Building2, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

/**
 * Enterprise Login Page Component for ACRELY
 * 
 * Specifications:
 * - Application Name: ACRELY
 * - Subtitles:
 *   1. Advanced Commercial Rental & Estate Logistics
 *   2. Warehouse Rental Management System
 * - Design: Centered card, White background, Primary Blue (#2563EB), Light Gray Page (#F8FAFC),
 *   Rounded corners, Soft shadow.
 * - Form Controls: Email Address, Password, Remember Me checkbox, Blue Sign In button.
 * - Rules: No Sign Up link, No Forgot Password link, Frontend-only placeholder validation.
 */

interface LoginViewProps {
  /**
   * Callback invoked when user successfully submits login credentials.
   * Navigates to the main enterprise dashboard.
   */
  onSignIn: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSignIn }) => {
  // Form input states
  const [email, setEmail] = useState<string>('admin@acrely.com');
  const [password, setPassword] = useState<string>('acrely2026');
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // UI state for loading & placeholder validation
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /**
   * Handle Login Form Submission
   * Performs client-side placeholder validation and navigates to the dashboard.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic placeholder validation
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // Simulate clean enterprise authentication feedback
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSignIn();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] flex flex-col justify-between items-center p-4 sm:p-6 lg:p-8 font-sans antialiased select-none">
      {/* Top Header Badge / System Indicator */}
      <div className="w-full max-w-md flex justify-between items-center py-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-gray-600">Enterprise Logistics Portal</span>
        </div>
        <span className="bg-blue-50 text-[#2563EB] border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
          v2.4 Production
        </span>
      </div>

      {/* Main Centered Login Card */}
      <main className="w-full max-w-md my-auto">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-8 sm:p-10 transition-all duration-300">
          
          {/* ACRELY Enterprise Header */}
          <div className="text-center space-y-2 mb-8">
            {/* Logo Badge */}
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#2563EB] text-white rounded-2xl shadow-md mb-3 ring-4 ring-blue-50">
              <Building2 className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Application Title */}
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111827]">
              ACRELY
            </h1>

            {/* Subtitle 1: Commercial Logistics Subtitle */}
            <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
              Advanced Commercial Rental & Estate Logistics
            </p>

            {/* Subtitle 2: Warehouse System Subtitle */}
            <p className="text-xs text-gray-500 font-medium">
              Warehouse Rental Management System
            </p>
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input 1: Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-[#111827]">
                Email Address
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@acrely.com"
                  className="w-full bg-white border border-[#E5E7EB] text-[#111827] text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors font-medium placeholder-gray-400"
                  required
                />
              </div>
            </div>

            {/* Input 2: Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-semibold text-[#111827]">
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full bg-white border border-[#E5E7EB] text-[#111827] text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-colors font-medium placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none z-10 cursor-pointer"
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
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB] accent-[#2563EB] cursor-pointer"
                />
                <span className="text-xs font-medium text-gray-600 select-none">
                  Remember Me
                </span>
              </label>
            </div>

            {/* Primary Action: Blue Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
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
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center flex items-center justify-center gap-1.5 text-gray-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Encrypted 256-bit SSL Commercial Portal</span>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-md text-center py-2 text-[11px] text-gray-400 font-medium">
        © {new Date().getFullYear()} ACRELY Logistics. All Rights Reserved.
      </footer>
    </div>
  );
};
