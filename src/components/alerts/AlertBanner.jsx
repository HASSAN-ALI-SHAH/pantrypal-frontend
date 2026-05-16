import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const AlertBanner = ({ alerts = [] }) => {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  const uniqueAlerts = Array.from(new Map(alerts.map(a => [a.id, a])).values());
  const critical = uniqueAlerts.filter(a => !a.dismissed && a.daysLeft <= 2);
  if (dismissed || critical.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        className="flex items-center gap-3 p-4 mb-6 rounded-2xl border"
        style={{
          background: 'linear-gradient(135deg, #FEF3C7, #FFF7ED)',
          borderColor: '#FDE68A',
        }}
      >
        <div className="p-2 bg-amber-100 rounded-xl flex-shrink-0">
          <AlertTriangle size={18} className="text-amber-600" />
        </div>
        <p className="flex-1 text-sm font-medium text-amber-800">
          <span className="font-bold">{critical.length} item{critical.length !== 1 ? 's' : ''}</span>
          {' '}
          {critical.length === 1 ? 'is expiring' : 'are expiring'} within 2 days! Take action now.
        </p>
        <button
          onClick={() => navigate('/alerts')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-lg hover:bg-amber-600 transition-colors flex-shrink-0"
        >
          View Alerts <ArrowRight size={12} />
        </button>
        <button onClick={() => setDismissed(true)} className="p-1 text-amber-500 hover:text-amber-700 hover:bg-amber-100 rounded-lg transition-colors flex-shrink-0">
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AlertBanner;
