import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Bell, ChefHat, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDaysLeft } from '../../utils/expiryUtils';
import { usePantry } from '../../context/PantryContext';
import toast from 'react-hot-toast';

const CATEGORY_EMOJIS = {
  Dairy: '🥛', Meat: '🥩', Vegetables: '🥦', Fruits: '🍎',
  Grains: '🌾', Bakery: '🍞', Beverages: '🧃', Spices: '🌶️',
  Frozen: '🧊', Condiments: '🍯', Snacks: '🍿', Other: '📦',
};

const ExpiryLoginPopup = ({ items, onClose }) => {
  const navigate = useNavigate();
  const { markConsumed } = usePantry();

  const handleConsumed = (id, name) => {
    markConsumed(id);
    toast.success(`${name} marked as consumed ✅`);
  };

  const handleViewAlerts = () => {
    navigate('/alerts');
    onClose();
  };

  const handleGetRecipes = () => {
    navigate('/recipes');
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        style={{ background: 'rgba(30, 58, 95, 0.6)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26, duration: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
          style={{ borderTop: '4px solid #1D4ED8', maxHeight: '90vh' }}
        >
          {/* Red Gradient Header */}
          <div
            className="p-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-white text-lg">Items Expiring Soon!</h2>
                <p className="text-white/75 text-xs mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''} need immediate attention</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Subheading */}
          <div className="px-5 py-3 bg-red-50 border-b border-red-100">
            <p className="text-red-700 text-sm">
              ⚠️ The following items will expire within 2 days. Please use them immediately.
            </p>
          </div>

          {/* Scrollable Item List */}
          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {items.map((item) => {
              const d = getDaysLeft(item.expiryDate);
              const isTomorrow = d === 1;
              const isToday = d <= 0;
              const label = isToday ? 'Expires Today!' : isTomorrow ? 'Expires Tomorrow' : `Expires in ${d} days`;
              const dotColor = (isToday || isTomorrow) ? '#EF4444' : '#F59E0B';

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  {/* Dot */}
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-text-dark text-sm">
                        {CATEGORY_EMOJIS[item.category] || '🍽️'} {item.name}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#EFF6FF', color: '#1D4ED8' }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="font-mono text-xs text-text-muted">{item.expiryDate}</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: dotColor }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleConsumed(item.id, item.name)}
                      className="text-xs px-2 py-1 rounded-lg border border-green-100 bg-green-50 text-green-600 hover:bg-green-100 transition-all flex items-center gap-1"
                    >
                      <CheckCircle size={11} /> Used
                    </button>
                    <button
                      onClick={handleGetRecipes}
                      className="text-xs px-2 py-1 rounded-lg border border-blue-100 bg-blue-50 text-primary hover:bg-blue-100 transition-all flex items-center gap-1"
                    >
                      <ChefHat size={11} /> Recipe
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleViewAlerts}
              className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
            >
              <Bell size={15} /> View All Alerts
            </button>
            <button
              onClick={handleGetRecipes}
              className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
            >
              <ChefHat size={15} /> Get Recipe Ideas
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-text-muted border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExpiryLoginPopup;
