import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, BellOff } from 'lucide-react';
import { formatDate, formatRelative } from '../../utils/dateUtils';

const AlertItem = ({ alert, onConsume, onDismiss, index = 0 }) => {
  const navigate = useNavigate();

  const borderColor =
    alert.daysLeft < 0 ? '#EF4444' :
    alert.daysLeft <= 2 ? '#F97316' : '#F59E0B';

  const bgColor =
    alert.daysLeft < 0 ? 'bg-red-50' :
    alert.daysLeft <= 2 ? 'bg-orange-50' : 'bg-amber-50';

  const catEmoji = {
    Dairy: '🥛', Vegetables: '🥦', Fruits: '🍎',
    Grains: '🌾', Beverages: '🧃', Meat: '🥩', Other: '📦',
  }[alert.category] || '📦';

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all`}
      style={{ borderLeftWidth: 4, borderLeftColor: borderColor }}
    >
      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0 text-xl`}>
        {catEmoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-heading font-semibold text-text-dark text-sm">{alert.itemName}</span>
          <span className={`badge ${alert.status.badgeClass}`}>{alert.status.label}</span>
        </div>
        <p className="text-sm text-text-muted mb-1">
          {alert.daysLeft < 0
            ? `Expired ${Math.abs(alert.daysLeft)} day${Math.abs(alert.daysLeft) !== 1 ? 's' : ''} ago`
            : alert.daysLeft === 0 ? '🔥 Expires today!'
            : `Expires in ${alert.daysLeft} day${alert.daysLeft !== 1 ? 's' : ''}`}
          {' · '}
          <span className="font-mono text-xs">{formatDate(alert.expiryDate)}</span>
        </p>
        <p className="text-xs text-gray-400">{alert.category} · {formatRelative(alert.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={() => navigate(`/edit-item/${alert.itemId}`)}
          className="btn btn-outline btn-sm gap-1 !py-1"
        >
          <Eye size={12} /> View
        </button>
        <button
          onClick={() => onConsume?.(alert.itemId)}
          className="btn btn-sm gap-1 !py-1 bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 rounded-lg font-semibold text-xs"
        >
          <CheckCircle size={12} /> Consumed
        </button>
        <button
          onClick={() => onDismiss?.(alert.id)}
          className="btn btn-sm gap-1 !py-1 bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100 rounded-lg font-semibold text-xs"
        >
          <BellOff size={12} /> Dismiss
        </button>
      </div>
    </motion.div>
  );
};

export default AlertItem;
