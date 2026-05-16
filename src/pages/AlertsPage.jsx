import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import AlertPanel from '../components/alerts/AlertPanel';
import toast from 'react-hot-toast';

import { getExpiryStatus } from '../utils/expiryUtils';

const API_URL = 'http://localhost:5000/api';
const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('pantrypal_token')}`
});

const tabs = [
  { value: 'all',      label: 'All Alerts' },
  { value: 'critical', label: '🔴 Critical' },
  { value: 'soon',     label: '🟡 Soon' },
  { value: 'expired',  label: '⚠️ Expired' },
];

const AlertsPage = () => {
  const [alerts, setAlerts]       = useState([]);
  const [summary, setSummary]     = useState({ expired: 0, critical: 0, soon: 0, total: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading]     = useState(true);
  const [dismissed, setDismissed] = useState(new Set());

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/alerts`, { headers: authHeaders() });
      const data = await res.json();
      if (data.success) {
        setAlerts(data.alerts ? data.alerts.map(a => ({ ...a, status: getExpiryStatus(a.daysLeft) })) : []);
        setSummary(data.summary || { expired: 0, critical: 0, soon: 0, total: 0 });
      }
    } catch {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  // Filter by tab, exclude locally-dismissed
  const activeAlerts = (() => {
    const visible = alerts.filter(a => !dismissed.has(String(a.id)));
    switch (activeTab) {
      case 'critical': return visible.filter(a => a.daysLeft >= 0 && a.daysLeft <= 2);
      case 'soon':     return visible.filter(a => a.daysLeft > 2 && a.daysLeft <= 5);
      case 'expired':  return visible.filter(a => a.daysLeft < 0);
      default:         return visible;
    }
  })();

  const handleConsume = async (itemId) => {
    try {
      await fetch(`${API_URL}/pantry/${itemId}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ status: 'consumed' })
      });
      // Remove that alert from local list
      setAlerts(prev => prev.filter(a => a.itemId !== itemId));
      toast.success('Marked as consumed! ✅');
    } catch {
      toast.error('Failed to update item');
    }
  };

  const handleDismiss = async (alertId) => {
    // Optimistic local dismiss
    setDismissed(prev => new Set([...prev, String(alertId)]));
    toast('Alert dismissed', { icon: '🔕' });

    // If it's a real DB alert id (not 'pantry_X'), persist to DB
    if (!String(alertId).startsWith('pantry_')) {
      try {
        await fetch(`${API_URL}/alerts/${alertId}/dismiss`, {
          method: 'PATCH',
          headers: authHeaders()
        });
      } catch { /* non-critical */ }
    }
  };

  const handleRefresh = async () => {
    // Regenerate alerts from current pantry state
    try {
      await fetch(`${API_URL}/alerts/generate`, {
        method: 'POST',
        headers: authHeaders()
      });
    } catch { /* non-critical */ }
    setDismissed(new Set());
    await fetchAlerts();
    toast.success('Alerts refreshed');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-dark">Alerts</h1>
          <p className="text-text-muted mt-1">Monitor items that need your immediate attention.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="btn-secondary text-sm flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: XCircle,       label: 'Expired',            value: summary.expired,                color: 'red-50',   text: 'red-600',   border: 'red-200' },
          { icon: AlertTriangle, label: 'Expiring This Week', value: summary.critical + summary.soon, color: 'amber-50', text: 'amber-700', border: 'amber-200' },
          { icon: Bell,          label: 'Total Alerts',       value: summary.total,                  color: 'blue-50',  text: 'primary',   border: 'blue-200' },
        ].map(({ icon: Icon, label, value, color, text, border }) => (
          <div key={label} className={`flex items-center gap-4 p-5 bg-${color} border border-${border} rounded-2xl`}>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <Icon size={22} className={`text-${text}`} />
            </div>
            <div>
              <div className={`font-mono text-3xl font-bold text-${text}`}>{value}</div>
              <p className="text-text-muted text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => setActiveTab(t.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === t.value ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <RefreshCw size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-muted">Loading alerts from database...</p>
        </div>
      )}

      {/* Alert list */}
      {!loading && (
        <AlertPanel alerts={activeAlerts} onConsume={handleConsume} onDismiss={handleDismiss} />
      )}
    </motion.div>
  );
};

export default AlertsPage;
