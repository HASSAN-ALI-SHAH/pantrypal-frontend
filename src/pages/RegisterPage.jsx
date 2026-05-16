import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ChefHat, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const map = [
    { label: '', color: '' },
    { label: 'Weak', color: 'bg-red-400' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Good', color: 'bg-blue-400' },
    { label: 'Strong', color: 'bg-green-500' },
  ];
  return { score, ...map[score] };
};

const RegisterPage = () => {
  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', terms: false, otp: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const strength = getStrength(form.password);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (!form.terms) errs.terms = 'You must accept the terms';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    const result = await register(form.name, form.email, form.password);
    setLoading(false);

    if (result.success) {
      toast.success(result.message || 'OTP sent to your email!');
      setStep(2); // Move to OTP step
    } else {
      toast.error(result.error);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!form.otp || form.otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return;
    }

    setLoading(true);
    const result = await verifyOTP(form.email, form.otp);
    setLoading(false);

    if (result.success) {
      toast.success('Account verified! You can now log in. 🎉');
      navigate('/login');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-row-reverse">
      {/* Right — decorative */}
      <div className="hidden lg:flex flex-1 hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
        <motion.div className="relative z-10 text-center" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-7xl mb-6 animate-float">🥗</div>
          <h2 className="font-heading text-4xl font-bold text-white mb-3">Join PantryPal!</h2>
          <p className="text-white/70 text-lg max-w-sm">Create your account and start managing your pantry like a pro.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {['🥦 Track 20+ categories', '🔔 Smart alerts', '📊 Waste analytics', '💾 Offline storage'].map(t => (
              <div key={t} className="px-3 py-2 bg-white/10 border border-white/15 rounded-xl text-white/80 text-sm">{t}</div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <ChefHat size={24} className="text-primary" /><span className="font-heading font-bold text-xl text-text-dark">PantryPal</span>
          </div>
          
          {step === 1 ? (
            <>
              <h1 className="font-heading text-3xl font-bold text-text-dark mb-2">Create account</h1>
              <p className="text-text-muted mb-8">Already have one? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>

              <form onSubmit={handleRegisterSubmit} noValidate>
                <Input label="Full Name" type="text" placeholder="Alex Johnson" icon={User}
                  value={form.name} onChange={set('name')} error={errors.name}
                  success={form.name.trim().length > 1 && !errors.name}
                />
                <Input label="Email Address" type="email" placeholder="you@example.com" icon={Mail}
                  value={form.email} onChange={set('email')} error={errors.email}
                  success={form.email.includes('@') && !errors.email}
                />
                <div className="mb-1">
                  <Input label="Password" type="password" placeholder="Create a strong password" icon={Lock}
                    value={form.password} onChange={set('password')} error={errors.password}
                  />
                  {form.password && (
                    <div className="mb-4 -mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                        ))}
                      </div>
                      <span className={`text-xs font-semibold ${strength.score <= 1 ? 'text-red-400' : strength.score === 2 ? 'text-amber-500' : strength.score === 3 ? 'text-blue-500' : 'text-green-600'}`}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>
                <Input label="Confirm Password" type="password" placeholder="Repeat your password" icon={Lock}
                  value={form.confirm} onChange={set('confirm')} error={errors.confirm}
                  success={form.confirm.length > 0 && form.confirm === form.password}
                />

                <label className={`flex items-start gap-2 text-sm mb-6 cursor-pointer ${errors.terms ? 'text-red-500' : 'text-text-muted'}`}>
                  <input type="checkbox" checked={form.terms} onChange={set('terms')} className="mt-0.5 rounded" />
                  <span>I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <p className="input-error-msg -mt-4 mb-4">{errors.terms}</p>}

                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                  Create Account <ArrowRight size={16} />
                </Button>
              </form>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <KeyRound size={32} />
              </div>
              <h1 className="font-heading text-3xl font-bold text-text-dark mb-2">Check your email</h1>
              <p className="text-text-muted mb-8">We've sent a 6-digit verification code to <strong>{form.email}</strong>. Please enter it below.</p>

              <form onSubmit={handleOTPSubmit} noValidate>
                <Input label="Verification Code" type="text" placeholder="123456" icon={KeyRound}
                  value={form.otp} onChange={set('otp')} error={errors.otp}
                  maxLength={6}
                />
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-4">
                  Verify Account <ArrowRight size={16} />
                </Button>
                <button type="button" onClick={() => setStep(1)} className="mt-6 text-sm text-text-muted hover:text-primary transition-colors block text-center w-full">
                  Change email address
                </button>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
