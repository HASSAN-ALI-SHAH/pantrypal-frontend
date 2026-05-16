import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle, Bot, Share2, Printer, Trash2, RotateCcw } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import GroceryBuyList from '../components/grocery/GroceryBuyList';
import GroceryItem from '../components/grocery/GroceryItem';
import { formatDate } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, delay }) => {
  const styles = {
    blue:  { border: '#3B82F6', bg: '#EFF6FF', iconColor: '#1D4ED8' },
    green: { border: '#10B981', bg: '#ECFDF5', iconColor: '#059669' },
    amber: { border: '#F59E0B', bg: '#FFFBEB', iconColor: '#D97706' },
  }[color] || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl p-5 shadow-card"
      style={{ borderLeft: `4px solid ${styles.border}` }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl" style={{ background: styles.bg }}>
          <Icon size={20} style={{ color: styles.iconColor }} />
        </div>
        <div>
          <div className="font-mono text-2xl font-bold text-text-dark">{value}</div>
          <p className="text-text-muted text-xs">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

const GroceryPage = () => {
  const { groceryList, restoreGroceryItem, clearPurchasedHistory, toggleGroceryPurchased } = usePantry();

  const today = new Date().toDateString();
  const toBuy = groceryList.filter((g) => !g.purchased);
  const purchased = groceryList.filter((g) => g.purchased);
  const purchasedToday = purchased.filter((g) => g.purchasedAt && new Date(g.purchasedAt).toDateString() === today);
  const autoAdded = toBuy.filter((g) => g.triggeredBy === 'auto').length;

  // Last 7 days
  const recentPurchased = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return purchased.filter((g) => g.purchasedAt && new Date(g.purchasedAt).getTime() >= cutoff);
  }, [purchased]);

  const handleShareList = () => {
    const text = toBuy.map((g) => `• ${g.itemName} — ${g.suggestedQuantity} ${g.unit}`).join('\n');
    if (!text) { toast('No items to share!', { icon: '🛒' }); return; }
    navigator.clipboard.writeText(text);
    toast.success('Grocery list copied to clipboard! 📋');
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-blue-sm">
            <ShoppingCart size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-dark">Smart Grocery List</h1>
            <p className="text-text-muted text-sm mt-0.5">Auto-generated from low-stock pantry items</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShareList}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <Share2 size={14} /> Share List
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            <Printer size={14} /> Print PDF
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={ShoppingCart} label="Items to Buy"     value={toBuy.length}           color="blue"  delay={0.05} />
        <StatCard icon={CheckCircle} label="Purchased Today"   value={purchasedToday.length}  color="green" delay={0.10} />
        <StatCard icon={Bot}         label="Auto-Added"         value={autoAdded}              color="amber" delay={0.15} />
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT: Buy List (wider) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-white rounded-2xl shadow-card p-5"
        >
          <GroceryBuyList />
        </motion.div>

        {/* RIGHT: Purchase History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-text-dark flex items-center gap-2">
              <CheckCircle size={17} className="text-green-500" /> Recently Purchased
            </h2>
            {recentPurchased.length > 0 && (
              <button
                onClick={clearPurchasedHistory}
                className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>

          {recentPurchased.length === 0 ? (
            <div className="py-10 text-center text-text-muted">
              <span className="text-3xl mb-2 block">🛒</span>
              <p className="text-sm">No purchased items in the last 7 days</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {recentPurchased.map((item) => (
                  <GroceryItem
                    key={item.id}
                    item={item}
                    isHistory
                    onRestore={restoreGroceryItem}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GroceryPage;
