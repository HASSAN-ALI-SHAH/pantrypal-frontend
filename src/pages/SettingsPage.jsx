import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Settings2, Database, Save, Trash2, Download, Lock, Mail, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePantry } from '../context/PantryContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const tabs = [
  { value: 'profile',  label: 'Profile',           icon: User },
  { value: 'alerts',   label: 'Alert Preferences', icon: Bell },
  { value: 'pantry',   label: 'Pantry Prefs',      icon: Settings2 },
  { value: 'data',     label: 'Data Management',   icon: Database },
];

const SettingsPage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { settings, updateSettings, clearAllItems, resetApp, items } = usePantry();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1 = credentials, 2 = OTP, 3 = final confirm
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  const setP = (f) => (e) => setProfileForm(p => ({ ...p, [f]: e.target.value }));
  const setS = (f) => (v) => updateSettings({ [f]: v });

  const isProfileDirty = profileForm.name !== (user?.name || '') || profileForm.email !== (user?.email || '');

  const saveProfile = async () => {
    if (!isProfileDirty) {
      toast('No changes to save.', { icon: 'ℹ️' });
      return;
    }
    setSavingProfile(true);
    const result = await updateProfile(profileForm);
    setSavingProfile(false);
    if (result?.success !== false) {
      toast.success('Profile updated! ✅');
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
  };

  const handleClear = () => {
    clearAllItems();
    setClearDialogOpen(false);
    toast.success('All items cleared');
  };

  const handleCloseResetModal = () => {
    setResetModalOpen(false);
    setResetStep(1);
    setResetEmail('');
    setResetPassword('');
    setResetOtp('');
    setResetLoading(false);
    setResetError('');
  };

  const handleInitiateReset = async (e) => {
    if (e) e.preventDefault();
    setResetLoading(true);
    setResetError('');
    try {
      const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://pantrypal-backend-bay.vercel.app/api';

      const res = await fetch(`${apiBase}/settings/reset/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('pantrypal_token')}`
        },
        body: JSON.stringify({ email: resetEmail.trim(), password: resetPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Verification failed');
      }
      toast.success('Verification successful! OTP sent to your email. 📧');
      setResetStep(2);
      setResetPassword('');
    } catch (err) {
      setResetError(err.message || 'Failed to verify credentials');
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyResetOTP = async (e) => {
    if (e) e.preventDefault();
    setResetLoading(true);
    setResetError('');
    try {
      const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://pantrypal-backend-bay.vercel.app/api';

      const res = await fetch(`${apiBase}/settings/reset/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('pantrypal_token')}`
        },
        body: JSON.stringify({ otp: resetOtp.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'OTP verification failed');
      }
      toast.success('OTP verified successfully! ✅');
      setResetStep(3);
    } catch (err) {
      setResetError(err.message || 'Invalid OTP');
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    setResetLoading(true);
    setResetError('');
    try {
      await resetApp();
      logout();
      handleCloseResetModal();
      toast('App reset. Please log in again.', { icon: '🔄' });
      navigate('/login');
    } catch (err) {
      setResetError(err.message || 'Failed to reset application');
    } finally {
      setResetLoading(false);
    }
  };

  const exportJSON = async () => {
    try {
      const apiBase = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000/api'
        : 'https://pantrypal-backend-bay.vercel.app/api';
      const res = await fetch(`${apiBase}/settings/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('pantrypal_token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'pantrypal-data.json'; a.click();
        URL.revokeObjectURL(url);
        toast.success('Data exported!');
      }
    } catch {
      // Fallback: export local items state
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'pantrypal-data.json'; a.click();
      URL.revokeObjectURL(url);
      toast.success('Data exported (local)!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-dark">Settings</h1>
        <p className="text-text-muted mt-1">Manage your profile, preferences, and data.</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Tab sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-card p-2 space-y-1">
            {tabs.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveTab(value)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === value ? 'bg-primary text-white' : 'text-text-muted hover:bg-gray-50 hover:text-text-dark'}`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-heading font-bold text-xl text-text-dark mb-6">Profile Settings</h2>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-3xl shadow-blue-md">
                    {profileForm.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-text-dark">{profileForm.name}</p>
                    <p className="text-text-muted text-sm">{profileForm.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Input label="Full Name" value={profileForm.name} onChange={setP('name')} placeholder="Your full name" />
                  <Input label="Email Address" type="email" value={profileForm.email} onChange={setP('email')} placeholder="your@email.com" />
                </div>
                <Button variant="primary" icon={Save} loading={savingProfile} onClick={saveProfile} disabled={!isProfileDirty}>Save Changes</Button>
              </div>
            )}

            {/* Alert Preferences */}
            {activeTab === 'alerts' && (
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-heading font-bold text-xl text-text-dark mb-6">Alert Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="input-label mb-3 block">Alert me {settings.alertDays} days before expiry</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min={1} max={14} step={1}
                        value={settings.alertDays}
                        onChange={e => setS('alertDays')(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="font-mono font-bold text-primary text-lg w-8 text-center">{settings.alertDays}</span>
                    </div>
                    <div className="flex justify-between text-xs text-text-muted mt-1">
                      <span>1 day</span><span>14 days</span>
                    </div>
                  </div>
                  {[
                    { key: 'browserNotifications', label: 'Browser Notifications', desc: 'Show system notifications when items are critical' },
                    { key: 'showExpiredInDashboard', label: 'Show Expired in Dashboard', desc: 'Include expired items in dashboard stats' },
                    { key: 'alertSound', label: 'Alert Sound', desc: 'Play a sound when critical alerts appear' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-text-dark text-sm">{label}</p>
                        <p className="text-text-muted text-xs mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setS(key)(!settings[key])}
                        className={`relative w-11 h-6 rounded-full transition-all ${settings[key] ? 'bg-primary' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${settings[key] ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pantry Preferences */}
            {activeTab === 'pantry' && (
              <div className="bg-white rounded-2xl shadow-card p-7">
                <h2 className="font-heading font-bold text-xl text-text-dark mb-6">Pantry Preferences</h2>
                <div className="space-y-5">
                  <div>
                    <label className="input-label">Default Unit</label>
                    <select value={settings.defaultUnit} onChange={e => setS('defaultUnit')(e.target.value)} className="input-field">
                      {['Pieces', 'Kg', 'Grams', 'Liters', 'Packs', 'Bottles'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Default Category</label>
                    <select value={settings.defaultCategory} onChange={e => setS('defaultCategory')(e.target.value)} className="input-field">
                      {['Dairy','Vegetables','Fruits','Grains','Beverages','Meat','Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Items Per Page</label>
                    <select value={settings.itemsPerPage} onChange={e => setS('itemsPerPage')(Number(e.target.value))} className="input-field">
                      {[10, 20, 50].map(n => <option key={n} value={n}>{n} items</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Data Management */}
            {activeTab === 'data' && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl shadow-card p-7">
                  <h2 className="font-heading font-bold text-xl text-text-dark mb-2">Export Data</h2>
                  <p className="text-text-muted text-sm mb-5">Download all your pantry data as JSON or CSV.</p>
                  <div className="flex gap-3">
                    <Button variant="outline" icon={Download} onClick={exportJSON}>Export JSON</Button>
                  </div>
                </div>
                <div className="border-2 border-red-100 bg-red-50 rounded-2xl p-7">
                  <h2 className="font-heading font-bold text-xl text-red-700 mb-2">⚠️ Danger Zone</h2>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-100">
                      <div>
                        <p className="font-medium text-red-800">Clear All Items</p>
                        <p className="text-red-500 text-sm">Remove all pantry items. Settings are preserved.</p>
                      </div>
                      <Button variant="danger" onClick={() => setClearDialogOpen(true)}>Clear Items</Button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-red-800">Reset App</p>
                        <p className="text-red-500 text-sm">Wipe everything and restore to factory defaults.</p>
                      </div>
                      <Button variant="danger" icon={Trash2} onClick={() => setResetModalOpen(true)}>Reset App</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={handleClear}
        title="Clear All Items?"
        message="This will permanently delete all pantry items. Your settings will remain."
        confirmLabel="Clear All"
      />
      <Modal
        isOpen={resetModalOpen}
        onClose={handleCloseResetModal}
        title="Reset Application Data"
        maxWidth="500px"
      >
        <div className="space-y-4">
          {resetError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              ⚠️ {resetError}
            </div>
          )}

          {resetStep === 1 && (
            <form onSubmit={handleInitiateReset} className="space-y-4">
              <p className="text-text-muted text-sm leading-relaxed">
                For security reasons, resetting the application requires credentials verification. Please enter your account email and password to receive a verification OTP.
              </p>
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your registered email"
                icon={Mail}
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                icon={Lock}
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={handleCloseResetModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={resetLoading} disabled={!resetEmail || !resetPassword}>
                  Send OTP Code
                </Button>
              </div>
            </form>
          )}

          {resetStep === 2 && (
            <form onSubmit={handleVerifyResetOTP} className="space-y-4">
              <p className="text-text-muted text-sm leading-relaxed">
                We've sent a 6-digit OTP code to <strong className="text-text-dark">{resetEmail}</strong>. Please enter the verification code below to proceed.
              </p>
              <Input
                label="Verification Code (OTP)"
                type="text"
                placeholder="Enter 6-digit OTP"
                icon={KeyRound}
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                maxLength={6}
                required
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={handleCloseResetModal}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" loading={resetLoading} disabled={resetOtp.length < 6}>
                  Verify Code
                </Button>
              </div>
            </form>
          )}

          {resetStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3">
                <ShieldCheck size={28} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800">Are you absolutely sure?</h4>
                  <p className="text-red-700 text-sm mt-1 leading-relaxed">
                    This will permanently delete all your items, grocery list, logs, settings, and log you out. This action is irreversible.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" type="button" onClick={handleCloseResetModal}>
                  Cancel
                </Button>
                <Button variant="danger" type="button" onClick={handleConfirmReset} loading={resetLoading}>
                  Yes, Reset Everything
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

export default SettingsPage;
