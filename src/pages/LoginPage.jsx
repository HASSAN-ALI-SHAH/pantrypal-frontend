import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ChefHat, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePantry } from '../context/PantryContext';
import { getDaysLeft } from '../utils/expiryUtils';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ExpiryLoginPopup from '../components/modals/ExpiryLoginPopup';
import toast from 'react-hot-toast';

const floatingEmojis = [
  { e: '🥦', x: '10%', y: '20%', d: 4 }, { e: '🍎', x: '80%', y: '15%', d: 5 },
  { e: '🥛', x: '15%', y: '75%', d: 3.5 }, { e: '🧀', x: '85%', y: '70%', d: 4.5 },
  { e: '🥕', x: '50%', y: '10%', d: 5 },
];

const LoginPage = () => {
  const { login } = useAuth();
  const { items } = usePantry();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
  const [expiryItems, setExpiryItems] = useState([]);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) { setShake(true); setTimeout(() => setShake(false), 500); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      toast.success('Welcome back! 👋');

      // Check for expiry popup — only once per session
      const alreadyShown = sessionStorage.getItem('expiryPopupShown');
      if (!alreadyShown) {
        const soonItems = items.filter(
          (item) => item.status === 'active' && getDaysLeft(item.expiryDate) <= 2
        );
        if (soonItems.length > 0) {
          setExpiryItems(soonItems);
          setShowExpiryPopup(true);
          sessionStorage.setItem('expiryPopupShown', 'true');
          return; // wait for modal dismissal before navigating
        }
      }

      navigate('/dashboard');
    } else {
      setErrors({ auth: result.error });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handlePopupClose = () => {
    setShowExpiryPopup(false);
    navigate('/dashboard');
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left — decorative */}
        <div className="hidden lg:flex flex-1 hero-gradient relative overflow-hidden flex-col items-center justify-center p-12">
          {floatingEmojis.map((e, i) => (
            <div key={i} className="floating-emoji" style={{ left: e.x, top: e.y, '--duration': `${e.d}s`, '--delay': `${i * 0.5}s` }}>{e.e}</div>
          ))}
          <motion.div className="relative z-10 text-center" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <ChefHat size={36} className="text-white" />
            </div>
            <h2 className="font-heading text-4xl font-bold text-white mb-3">Welcome Back!</h2>
            <p className="text-white/70 text-lg max-w-sm">Your pantry is waiting. Sign in to check what needs your attention.</p>

          </motion.div>
        </div>

        {/* Right — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
          <motion.div
            className={`w-full max-w-md ${shake ? 'animate-shake' : ''}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <ChefHat size={24} className="text-primary" />
              <span className="font-heading font-bold text-xl text-text-dark">PantryPal</span>
            </div>
            <h1 className="font-heading text-3xl font-bold text-text-dark mb-2">Sign in</h1>
            <p className="text-text-muted mb-8">Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register free</Link></p>

            {errors.auth && (
              <div className="p-3 mb-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                ⚠️ {errors.auth}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Input label="Email Address" type="email" placeholder="admin@pantrypal.com" icon={Mail}
                value={form.email} onChange={set('email')} error={errors.email}
                success={form.email.includes('@') && !errors.email}
              />
              <Input label="Password" type="password" placeholder="Enter your password" icon={Lock}
                value={form.password} onChange={set('password')} error={errors.password}
                success={form.password.length >= 8 && !errors.password}
              />

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
                  <input type="checkbox" checked={form.remember} onChange={set('remember')} className="rounded" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                Sign In <ArrowRight size={16} />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Expiry Login Popup */}
      <AnimatePresence>
        {showExpiryPopup && (
          <ExpiryLoginPopup items={expiryItems} onClose={handlePopupClose} />
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginPage;
