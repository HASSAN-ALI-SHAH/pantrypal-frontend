import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChefHat, ArrowRight, ArrowLeft, ShieldCheck, KeyRound, RefreshCw, CheckCircle2 } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const API = 'https://pantrypal-backend-wine.vercel.app/api';

// ── OTP digit input boxes ──────────────────────────────────────
const OTPInput = ({ value, onChange }) => {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = digits.map((d, idx) => idx === i ? '' : d).join('');
      onChange(next);
      if (i > 0) refs[i - 1].current?.focus();
    } else if (/^\d$/.test(e.key)) {
      const next = digits.map((d, idx) => idx === i ? e.key : d).join('');
      onChange(next);
      if (i < 5) refs[i + 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    refs[Math.min(pasted.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(i, e)}
          className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all outline-none
            ${d ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 bg-gray-50 text-gray-800'}
            focus:border-primary focus:bg-blue-50 focus:ring-2 focus:ring-blue-100`}
        />
      ))}
    </div>
  );
};

// ── Step indicator ────────────────────────────────────────────
const StepDot = ({ active, done, label, n }) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
      ${done ? 'bg-green-500 text-white' : active ? 'bg-primary text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'}`}>
      {done ? <CheckCircle2 size={16} /> : n}
    </div>
    <span className={`text-xs font-medium ${active ? 'text-primary' : done ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
  </div>
);

// ── Main page ────────────────────────────────────────────────
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password, 4=success
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Step 1: Send OTP ───────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('OTP sent! Check your inbox 📧');
        setStep(2);
        setResendCooldown(60);
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ─────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.replace(/\s/g, '').length < 6) { setError('Please enter the complete 6-digit OTP.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-reset-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('OTP verified! ✅');
        setStep(3);
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Set new password ───────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(4);
        toast.success('Password updated successfully! 🎉');
      } else {
        setError(data.message || 'Failed to reset password. Please start over.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ─────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('New OTP sent! 📧');
        setOtp('');
        setResendCooldown(60);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = passwordStrength(newPassword);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'][strength];

  const slideVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #06B6D4 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          {['🔒','🛡️','✉️','🔑','🥦','🍎','🥕'].map((e, i) => (
            <span key={i} className="floating-emoji text-4xl" style={{ left: `${10 + i * 13}%`, top: `${15 + (i % 3) * 25}%`, '--duration': `${3 + i * 0.5}s`, '--delay': `${i * 0.3}s` }}>{e}</span>
          ))}
        </div>
        <motion.div className="relative z-10 text-center" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 backdrop-blur-sm">
            <ShieldCheck size={44} className="text-white" />
          </div>
          <h2 className="font-heading text-4xl font-bold text-white mb-3">Secure Reset</h2>
          <p className="text-white/70 text-lg max-w-sm leading-relaxed">
            We'll send a one-time code to your registered email to verify it's really you.
          </p>
          <div className="mt-10 space-y-3">
            {['Enter your email address', 'Verify the OTP we send you', 'Set a new strong password'].map((t, i) => (
              <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${step > i ? 'text-white' : 'text-white/40'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${step > i ? 'bg-white text-primary' : 'bg-white/20 text-white/60'}`}>{i + 1}</div>
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <ChefHat size={24} className="text-primary" />
            <span className="font-heading font-bold text-xl text-text-dark">PantryPal</span>
          </div>

          {/* Step indicator (steps 1–3) */}
          {step < 4 && (
            <div className="flex items-center gap-2 mb-8">
              <StepDot n={1} label="Email"    active={step === 1} done={step > 1} />
              <div className={`flex-1 h-0.5 rounded transition-all duration-300 ${step > 1 ? 'bg-green-400' : 'bg-gray-200'}`} />
              <StepDot n={2} label="Verify"   active={step === 2} done={step > 2} />
              <div className={`flex-1 h-0.5 rounded transition-all duration-300 ${step > 2 ? 'bg-green-400' : 'bg-gray-200'}`} />
              <StepDot n={3} label="Password" active={step === 3} done={step > 3} />
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── STEP 1: Email ── */}
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <h1 className="font-heading text-3xl font-bold text-text-dark mb-2">Forgot Password?</h1>
                <p className="text-text-muted mb-8">No worries! Enter your registered email and we'll send you a reset code.</p>

                {error && (
                  <div className="p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSendOTP} noValidate>
                  <Input
                    label="Registered Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={Mail}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    success={email.includes('@') && email.includes('.')}
                  />
                  <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mb-4">
                    Send Reset Code <ArrowRight size={16} />
                  </Button>
                </form>
                <p className="text-center text-sm text-text-muted">
                  <Link to="/login" className="text-primary font-semibold hover:underline flex items-center justify-center gap-1">
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <Mail size={28} className="text-primary" />
                </div>
                <h1 className="font-heading text-3xl font-bold text-text-dark mb-2">Check Your Email</h1>
                <p className="text-text-muted mb-2">
                  We sent a 6-digit code to <span className="font-semibold text-text-dark">{email}</span>
                </p>
                <p className="text-xs text-text-muted mb-6">Didn't get it? Check spam or resend below.</p>

                {error && (
                  <div className="p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleVerifyOTP} noValidate>
                  <label className="input-label mb-3 block">Enter OTP</label>
                  <OTPInput value={otp} onChange={setOtp} />

                  <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mb-4"
                    disabled={otp.length < 6}>
                    Verify Code <ShieldCheck size={16} />
                  </Button>
                </form>

                <div className="flex items-center justify-between mt-2">
                  <button
                    onClick={() => { setStep(1); setOtp(''); setError(''); }}
                    className="text-sm text-text-muted hover:text-primary flex items-center gap-1 transition-colors"
                  >
                    <ArrowLeft size={14} /> Change email
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className={`text-sm flex items-center gap-1 font-semibold transition-colors
                      ${resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'}`}
                  >
                    <RefreshCw size={13} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: New Password ── */}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                  <KeyRound size={28} className="text-green-600" />
                </div>
                <h1 className="font-heading text-3xl font-bold text-text-dark mb-2">Set New Password</h1>
                <p className="text-text-muted mb-8">Choose a strong password you haven't used before.</p>

                {error && (
                  <div className="p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleResetPassword} noValidate>
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="At least 8 characters"
                    icon={Lock}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    success={newPassword.length >= 8}
                  />

                  {/* Strength bar */}
                  {newPassword.length > 0 && (
                    <div className="mb-4 -mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                            style={{ background: i <= strength ? strengthColor : '#e5e7eb' }} />
                        ))}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel}</p>
                    </div>
                  )}

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Repeat your password"
                    icon={Lock}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    success={confirmPassword.length >= 8 && confirmPassword === newPassword}
                    error={confirmPassword.length > 0 && confirmPassword !== newPassword ? "Passwords don't match" : ''}
                  />

                  <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                    Update Password <ArrowRight size={16} />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 4: Success ── */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
                className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100"
                >
                  <CheckCircle2 size={48} className="text-green-500" />
                </motion.div>
                <h1 className="font-heading text-3xl font-bold text-text-dark mb-3">Password Updated!</h1>
                <p className="text-text-muted mb-8 max-w-xs mx-auto">
                  Your password has been successfully changed. You can now sign in with your new password.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  Go to Sign In <ArrowRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
