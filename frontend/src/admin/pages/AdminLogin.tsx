import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, KeyRound, ShieldCheck, AlertCircle,
  ServerOff, RefreshCw, ArrowLeft, Sun, Moon,
  Mail, CheckCircle2, Clock, RotateCw, ArrowRight,
} from 'lucide-react';
import { useAdminAuth } from '../components/AdminAuthContext';
import { useBackendStatus } from '../../context/BackendStatusContext';
import { useTheme } from '../../context/ThemeContext';
import { BrandLogo } from '../../components/BrandLogo';
import { FloatingBackground } from '../components/ThreeDComponents';

export function AdminLoginPage() {
  const { verifyOtp, requestOtp, isAuthenticated } = useAdminAuth();
  const { isFullyAvailable, status, checkHealth, isChecking } = useBackendStatus();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Multi-step flow state
  // Step 1: Username entry (only show username input)
  // Step 2: Password entry (only shown when username is verified/correct)
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  // Countdown timer for 5-minute visual indication (300 seconds)
  const [secondsRemaining, setSecondsRemaining] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && isFullyAvailable) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isFullyAvailable, navigate]);

  // Visual 5-minute countdown timer
  useEffect(() => {
    if (step !== 2) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Resend cooldown timer (60s)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // STEP 1: Submit Username to request temporary 8-digit password
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!isFullyAvailable) {
      setError('Admin services are temporarily unavailable. Please verify backend & database.');
      return;
    }

    if (!username.trim()) {
      setError('Please enter your administrator username.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestOtp(username.trim());
      setMaskedEmail(res.maskedEmail || 'registered admin email');
      setSecondsRemaining(res.expiresInSeconds || 300);
      setResendCooldown(res.cooldownSeconds || 60);
      setStep(2);
      setSuccessMsg(`Temporary 8-digit password sent to ${res.maskedEmail || 'your email'}.`);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Invalid administrator username.';
      setError(msg);
      // Ensure password box remains hidden if username is not correct
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify submitted 8-digit OTP & Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim().replace(/\s+/g, '');
    if (!/^\d{8}$/.test(cleanOtp)) {
      setError('Please enter the complete 8-digit temporary password.');
      return;
    }

    if (secondsRemaining <= 0) {
      setError('The 5-minute expiration period has ended. Please request a new code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(username.trim(), cleanOtp);
      navigate('/admin/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Incorrect temporary password.';
      const remaining = err.response?.data?.attemptsRemaining;
      if (typeof remaining === 'number') {
        setAttemptsRemaining(remaining);
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler
  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;
    setError('');
    setSuccessMsg('');
    setResending(true);
    try {
      const res = await requestOtp(username.trim());
      setMaskedEmail(res.maskedEmail || maskedEmail);
      setSecondsRemaining(res.expiresInSeconds || 300);
      setResendCooldown(res.cooldownSeconds || 60);
      setOtp('');
      setAttemptsRemaining(null);
      setSuccessMsg('A fresh temporary 8-digit password has been dispatched to your email.');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Failed to resend code.';
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#f8faf9] via-[#eef4f2] to-[#e4eeeb] dark:from-[#020b0e] dark:via-[#05171e] dark:to-[#08222b] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden select-none">
      <FloatingBackground />

      {/* Top Header bar with Quick Website Link and Theme Switcher */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 bg-white/70 dark:bg-white/5 border border-teal-500/20 px-3.5 py-1.5 rounded-full shadow-sm backdrop-blur-md transition-all hover:scale-[1.02]"
        >
          <ArrowLeft size={14} />
          <span>Back to Website</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 dark:bg-white/5 border border-teal-500/20 text-slate-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 shadow-sm backdrop-blur-md transition-all hover:scale-105"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Main Form Center Area */}
      <main className="relative z-10 w-full max-w-md mx-auto px-6 py-4 flex-1 flex flex-col justify-center">
        {/* Brand Logo & Portal Heading */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#071c24]/90 border border-teal-500/25 mb-3.5 shadow-xl shadow-teal-900/10 dark:shadow-black/50 backdrop-blur-xl">
            <BrandLogo isDark={theme === 'dark'} className="h-10 sm:h-12 w-auto" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">
            Admin Portal
          </h1>
          <p className="text-slate-500 dark:text-teal-200/70 text-xs sm:text-sm font-medium">
            Preferred Tax Consultancy Executive CMS
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/85 dark:bg-[#071a22]/90 border border-teal-500/25 dark:border-teal-500/20 rounded-3xl p-7 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-teal-950/10 dark:shadow-black/70">
          {!isFullyAvailable && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 text-xs flex flex-col gap-2">
              <div className="flex items-center gap-2 font-bold">
                <ServerOff size={16} className="text-rose-500 shrink-0" />
                <span>Admin Services Temporarily Unavailable</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Backend connection is currently {status}. Login is protected until services are confirmed operational.
              </p>
              <button
                type="button"
                onClick={() => checkHealth()}
                disabled={isChecking}
                className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-800 dark:text-rose-200 font-semibold text-xs transition-colors"
              >
                <RefreshCw size={12} className={isChecking ? 'animate-spin' : ''} />
                {isChecking ? 'Checking System...' : 'Retry Connection'}
              </button>
            </div>
          )}

          {/* Step Heading */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {step === 1 ? 'Administrator Login' : 'Email Security Verification'}
              </h2>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300">
                Step {step} of 2
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
              {step === 1
                ? 'Enter your admin username to receive a secure 8-digit temporary password.'
                : 'Enter the 8-digit one-time password sent to your verified inbox.'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-start gap-2.5 mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-600 dark:text-red-400 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <div>
                <span>{error}</span>
                {attemptsRemaining !== null && attemptsRemaining > 0 && (
                  <div className="mt-1 font-semibold text-amber-600 dark:text-amber-400">
                    {attemptsRemaining} attempt{attemptsRemaining === 1 ? '' : 's'} remaining before password invalidation.
                  </div>
                )}
              </div>
            </div>
          )}

          {successMsg && !error && (
            <div className="flex items-start gap-2.5 mb-5 p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-700 dark:text-teal-300 text-xs font-medium">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-teal-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* STEP 1: Enter Username (Password box is NOT visible here) */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Admin Username or Email
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-[#030e13]/80 border border-slate-300 dark:border-teal-500/25 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 transition-all font-medium"
                    placeholder="e.g. admin"
                    required
                    autoFocus
                    autoComplete="username"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Only eligible and active administrator accounts receive login credentials.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isFullyAvailable || !username.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Verifying Username...</span>
                  </>
                ) : (
                  <>
                    <span>Next: Send Temporary Password</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Password Box (ONLY visible when username is correct & verified) */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Destination info & countdown timer */}
              <div className="p-3.5 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-xs">
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-teal-500" />
                    <span>Sent to:</span>
                  </span>
                  <span className="font-mono text-teal-600 dark:text-teal-300 font-bold">
                    {maskedEmail}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-teal-500/10">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-amber-500" />
                    <span>Code Expiry:</span>
                  </span>
                  <span className={`font-mono font-bold ${secondsRemaining < 60 ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}>
                    {formatTimer(secondsRemaining)} remaining
                  </span>
                </div>
              </div>

              {/* Password / OTP Input Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Temporary 8-Digit Password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={8}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 dark:bg-[#030e13]/80 border border-slate-300 dark:border-teal-500/25 rounded-xl text-center font-mono text-lg tracking-[0.35em] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/25 transition-all font-bold"
                    placeholder="••••••••"
                    required
                    autoFocus
                    autoComplete="one-time-code"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Valid for 5 minutes. Automatically invalidated after successful authentication.
                </p>
              </div>

              {/* Action Buttons: Verify & Login + Resend Code */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  disabled={loading || !isFullyAvailable || otp.length !== 8 || secondsRemaining <= 0}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Verify &amp; Login</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp('');
                      setError('');
                      setSuccessMsg('');
                      setAttemptsRemaining(null);
                    }}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  >
                    Change Username
                  </button>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resending}
                    className="inline-flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <RotateCw size={12} className={resending ? 'animate-spin' : ''} />
                    <span>
                      {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Security footnote inside card */}
          <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-500 dark:text-slate-400 mt-6 pt-5 border-t border-slate-200/80 dark:border-teal-500/15">
            <ShieldCheck size={13} className="text-teal-600 dark:text-teal-400" />
            <span>Encrypted SMTP delivery · 5-minute server expiration</span>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-20 w-full py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <span>© {new Date().getFullYear()} Smart Tax Experts (STE). All rights reserved.</span>
      </footer>
    </div>
  );
}

export default AdminLoginPage;
