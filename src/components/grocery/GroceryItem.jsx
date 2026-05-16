import { motion } from 'framer-motion';
import { Trash2, RotateCcw, Check } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

const CATEGORY_ICONS = {
  Dairy: '🥛', Meat: '🥩', Vegetables: '🥦', Fruits: '🍎',
  Grains: '🌾', Bakery: '🍞', Beverages: '🧃', Spices: '🌶️',
  Frozen: '🧊', Condiments: '🍯', Snacks: '🍿', Other: '📦',
};

const GroceryItem = ({ item, onOpenBuyModal, onRemove, onRestore, isHistory = false, isSelected = false, onSelect }) => {

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
        item.purchased
          ? 'bg-green-50 border-green-100'
          : 'bg-white border-gray-100 hover:border-blue-100'
      } ${isSelected ? 'ring-2 ring-primary' : ''}`}
    >
      {/* Checkbox / Select */}
      {!isHistory && (
        <div className="flex gap-2 flex-shrink-0">
          {onSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(item.id)}
              className="w-4 h-4 rounded accent-primary cursor-pointer"
            />
          )}
          {/* Circle button — opens the "how much did you buy?" modal */}
          <button
            onClick={() => onOpenBuyModal && onOpenBuyModal(item)}
            title="Mark as purchased"
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              item.purchased
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-primary'
            }`}
          >
            {item.purchased && <Check size={12} strokeWidth={3} />}
          </button>
        </div>
      )}

      {/* Icon */}
      <span className="text-xl flex-shrink-0">{CATEGORY_ICONS[item.category] || '📦'}</span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-2">
          <span
            className={`font-semibold text-sm ${
              item.purchased ? 'line-through text-text-muted' : 'text-text-dark'
            }`}
          >
            {item.itemName}
          </span>

          {/* Auto / Manual chip */}
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={
              item.triggeredBy === 'auto'
                ? { background: '#EFF6FF', color: '#1D4ED8' }
                : { background: '#F3F4F6', color: '#6B7280' }
            }
          >
            {item.triggeredBy === 'auto' ? '🤖 Auto' : '✏️ Manual'}
          </span>
        </div>

        {/* Qty */}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {!isHistory ? (
            <>
              <span className="font-mono text-xs text-text-muted">
                {item.suggestedQuantity} {item.unit}
              </span>
              {item.triggeredBy === 'auto' && item.minQuantity !== undefined && (
                <span className="text-xs text-text-muted">
                  Stock was low — click ○ to log purchase
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-text-muted font-mono">
              {item.suggestedQuantity} {item.unit} · Purchased {formatDate(item.purchasedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1.5 flex-shrink-0">
        {isHistory ? (
          <button
            onClick={() => onRestore(item.id)}
            className="text-xs px-2 py-1 rounded-lg border border-blue-100 bg-blue-50 text-primary hover:bg-blue-100 transition-all flex items-center gap-1"
          >
            <RotateCcw size={11} /> Restore
          </button>
        ) : (
          <button
            onClick={() => onRemove(item.id)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default GroceryItem;
