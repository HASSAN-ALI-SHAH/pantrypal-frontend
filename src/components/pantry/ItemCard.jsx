import { Edit2, Trash2, History, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProgressBar from '../ui/ProgressBar';
import { useExpiryStatus } from '../../hooks/useExpiryStatus';
import { categoryOptions } from '../../utils/mockData';

const catMap = Object.fromEntries(categoryOptions.map(c => [c.value, c]));

// onViewBatches receives (item, initialTab)
const ItemCard = ({ item, onDelete, onViewBatches, index = 0 }) => {
  const { status, freshnessPercent, expiryText } = useExpiryStatus(item);
  const navigate = useNavigate();
  const cat = catMap[item.category] || { icon: '📦', color: 'cat-other' };

  const cardBorderColor =
    status?.color === 'red' ? 'border-l-red-400' :
    status?.color === 'amber' ? 'border-l-amber-400' : 'border-l-green-400';

  const currentStock = item.currentQuantity ?? item.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`card-glass border-l-4 ${cardBorderColor} p-5 group relative overflow-hidden cursor-default`}
    >
      {/* Category badge */}
      <div className="flex items-start justify-between mb-3">
        <span className={`badge ${cat.color} text-sm`}>
          {cat.icon} {item.category}
        </span>
        {item.status !== 'active' && (
          <span className="badge badge-gray capitalize">{item.status}</span>
        )}
      </div>

      {/* Item name */}
      <h3 className="font-heading font-semibold text-text-dark text-base mb-1 line-clamp-1">{item.name}</h3>

      {/* Quantity */}
      <p className="text-text-muted text-sm mb-3 font-mono">{currentStock} {item.unit}</p>

      {/* Freshness bar */}
      <div className="mb-1.5">
        <ProgressBar value={freshnessPercent} />
      </div>

      {/* Expiry countdown */}
      <p className={`text-xs font-semibold mb-4 ${
        status?.color === 'red' ? 'text-red-500' :
        status?.color === 'amber' ? 'text-amber-600' : 'text-green-600'
      }`}>
        {status?.icon} {expiryText}
      </p>

      {/* Action buttons — slide up on hover */}
      <div className="flex gap-1.5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
        {/* Edit */}
        <button
          onClick={() => navigate(`/edit-item/${item.id}`)}
          className="flex-1 btn btn-outline btn-sm gap-1"
          title="Edit item"
        >
          <Edit2 size={12} /> Edit
        </button>

        {/* Log consumption — opens drawer on Consumption tab */}
        <button
          onClick={() => onViewBatches?.(item, 'consumption')}
          className="flex-1 btn btn-sm gap-1 bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
          title="Log how much you used"
        >
          <Utensils size={12} /> Use
        </button>

        {/* History — opens drawer on Purchase History tab */}
        <button
          onClick={() => onViewBatches?.(item, 'purchases')}
          className="flex-1 btn btn-sm gap-1 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
          title="Purchase & consumption history"
        >
          <History size={12} /> History
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete?.(item.id)}
          className="btn btn-icon btn-sm bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
};

export default ItemCard;
