import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Calendar, Clock, ShoppingBag, Utensils, Plus } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';
import toast from 'react-hot-toast';

function getExpiryInfo(dateStr) {
  if (!dateStr) return { label: 'No expiry set', color: 'text-text-muted', bg: 'bg-gray-50', dot: 'bg-gray-300' };
  const days = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { label: `Expired ${Math.abs(days)}d ago`, color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-400' };
  if (days === 0) return { label: 'Expires today!', color: 'text-red-500', bg: 'bg-red-50', dot: 'bg-red-400' };
  if (days <= 5) return { label: `Expires in ${days}d`, color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' };
  return { label: `Expires in ${days}d`, color: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-400' };
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const TABS = [
  { id: 'purchases', label: 'Purchase History', icon: ShoppingBag },
  { id: 'consumption', label: 'Consumption Log', icon: Utensils },
];

const ItemBatchesDrawer = ({ item, onClose, initialTab = 'purchases' }) => {
  const { fetchItemBatches, fetchConsumptionLog, logItemConsumption } = usePantry();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [batches, setBatches] = useState([]);
  const [consumptionLogs, setConsumptionLogs] = useState([]);
  const [totalConsumed, setTotalConsumed] = useState(0);
  const [loading, setLoading] = useState(true);

  // Consume modal state
  const [showConsumeModal, setShowConsumeModal] = useState(false);
  const [consumeForm, setConsumeForm] = useState({ qty: '', notes: '', consumedAt: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!item) return;
    setLoading(true);
    const [batchData, consumeData] = await Promise.all([
      fetchItemBatches(item.id),
      fetchConsumptionLog(item.id),
    ]);
    setBatches(batchData || []);
    setConsumptionLogs(consumeData.logs || []);
    setTotalConsumed(consumeData.totalConsumed || 0);
    setLoading(false);
  }, [item, fetchItemBatches, fetchConsumptionLog]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openConsumeModal = () => {
    setConsumeForm({ qty: '', notes: '', consumedAt: new Date().toISOString().split('T')[0] });
    setShowConsumeModal(true);
  };

  const handleLogConsumption = async () => {
    const qty = Number(consumeForm.qty);
    if (!qty || qty <= 0) return;
    const currentStock = item.currentQuantity ?? item.quantity ?? 0;
    if (qty > currentStock) {
      toast.error(`Only ${currentStock} ${item.unit} in stock!`);
      return;
    }
    setSubmitting(true);
    const res = await logItemConsumption(item.id, {
      quantity: qty,
      notes: consumeForm.notes,
      consumedAt: consumeForm.consumedAt,
    });
    setSubmitting(false);
    if (res.success) {
      toast.success(`Logged: ${qty} ${item.unit} consumed ✅`);
      setShowConsumeModal(false);
      // Refresh logs
      const consumeData = await fetchConsumptionLog(item.id);
      setConsumptionLogs(consumeData.logs || []);
      setTotalConsumed(consumeData.totalConsumed || 0);
      // Update local item reference for stock display
      if (res.item) item.currentQuantity = res.item.currentQuantity ?? res.item.quantity;
    } else {
      toast.error(res.message || 'Failed to log consumption');
    }
  };

  if (!item) return null;

  const totalPurchased = batches.reduce((sum, b) => sum + b.quantity, 0);
  const currentStock = item.currentQuantity ?? item.quantity ?? 0;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        key="drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-text-dark text-lg leading-tight">{item.name}</h2>
              <p className="text-text-muted text-xs">{item.category} · {item.unit}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-muted hover:text-text-dark transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stock Summary Cards */}
        <div className="mx-5 mt-4 mb-3 grid grid-cols-3 gap-2">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-center">
            <p className="text-xs text-text-muted mb-0.5">Current Stock</p>
            <p className="font-heading font-bold text-2xl text-primary">{currentStock}</p>
            <p className="text-xs text-text-muted">{item.unit}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
            <p className="text-xs text-text-muted mb-0.5">Total Bought</p>
            <p className="font-heading font-bold text-2xl text-green-600">{totalPurchased || '—'}</p>
            <p className="text-xs text-text-muted">{item.unit}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
            <p className="text-xs text-text-muted mb-0.5">Consumed</p>
            <p className="font-heading font-bold text-2xl text-orange-500">{totalConsumed || '—'}</p>
            <p className="text-xs text-text-muted">{item.unit}</p>
          </div>
        </div>

        {/* Log Consumption CTA */}
        <div className="mx-5 mb-3">
          <button
            onClick={openConsumeModal}
            className="w-full btn-primary text-sm flex items-center justify-center gap-2 py-2.5"
          >
            <Plus size={15} /> Log Consumption
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mx-5 mb-1 bg-gray-100 rounded-xl p-1 gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-dark'
              }`}
            >
              <tab.icon size={13} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 pt-3">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-text-muted">Loading…</p>
            </div>
          ) : activeTab === 'purchases' ? (
            /* ── Purchase History ── */
            batches.length === 0 ? (
              <div className="py-12 text-center">
                <span className="text-4xl block mb-3">📦</span>
                <p className="font-semibold text-text-dark">No purchase history yet</p>
                <p className="text-sm text-text-muted mt-1">
                  Purchase this item from the grocery list to create batch records.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {batches.map((batch, i) => {
                  const expiry = getExpiryInfo(batch.expiryDate);
                  return (
                    <motion.div
                      key={batch.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`rounded-xl border p-4 ${expiry.bg}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${expiry.dot} flex-shrink-0`} />
                          <span className="font-bold text-text-dark text-lg">
                            {batch.quantity}
                            <span className="text-sm font-normal text-text-muted ml-1">{batch.unit}</span>
                          </span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-white border ${expiry.color}`}>
                          {expiry.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <Calendar size={11} />
                          Bought: <span className="font-semibold text-text-dark">{formatDate(batch.entryDate)}</span>
                        </div>
                        {batch.expiryDate && (
                          <div className="flex items-center gap-1.5 text-xs text-text-muted">
                            <Clock size={11} />
                            Expires: <span className={`font-semibold ${expiry.color}`}>{formatDate(batch.expiryDate)}</span>
                          </div>
                        )}
                      </div>
                      {batch.notes && <p className="text-xs text-text-muted mt-1.5 italic">"{batch.notes}"</p>}
                    </motion.div>
                  );
                })}
              </div>
            )
          ) : (
            /* ── Consumption Log ── */
            consumptionLogs.length === 0 ? (
              <div className="py-12 text-center">
                <span className="text-4xl block mb-3">🍽️</span>
                <p className="font-semibold text-text-dark">No consumption logged yet</p>
                <p className="text-sm text-text-muted mt-1">
                  Click "Log Consumption" above whenever you use some of this item.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {consumptionLogs.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-600 text-base">
                          -{log.quantity}
                          <span className="text-xs font-normal text-text-muted ml-1">{log.unit}</span>
                        </span>
                        <span className="text-xs text-text-muted">consumed</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                        <Calendar size={10} />
                        {formatDate(log.consumedAt)}
                      </div>
                      {log.notes && (
                        <p className="text-xs text-text-muted italic mt-0.5 truncate">"{log.notes}"</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      </motion.div>

      {/* ── Log Consumption Modal ── */}
      {showConsumeModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
          >
            <h3 className="font-heading font-bold text-text-dark text-lg mb-1">🍽️ Log Consumption</h3>
            <p className="text-sm text-text-muted mb-5">
              How much <span className="font-semibold text-text-dark">{item.name}</span> did you use?
              <span className="block mt-0.5 text-primary font-semibold">{currentStock} {item.unit} currently in stock.</span>
            </p>

            <label className="input-label">Quantity Used ({item.unit})</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              max={currentStock}
              autoFocus
              placeholder={`Max: ${currentStock}`}
              value={consumeForm.qty}
              onChange={e => setConsumeForm(f => ({ ...f, qty: e.target.value }))}
              className="input-field mb-3"
            />

            <label className="input-label">Date Consumed</label>
            <input
              type="date"
              value={consumeForm.consumedAt}
              onChange={e => setConsumeForm(f => ({ ...f, consumedAt: e.target.value }))}
              className="input-field mb-3"
            />

            <label className="input-label">Notes <span className="text-text-muted font-normal">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. Used for dinner, Recipe: biryani…"
              value={consumeForm.notes}
              onChange={e => setConsumeForm(f => ({ ...f, notes: e.target.value }))}
              className="input-field mb-5"
            />

            <div className="flex gap-2">
              <button
                onClick={handleLogConsumption}
                disabled={!consumeForm.qty || Number(consumeForm.qty) <= 0 || submitting}
                className="btn-primary flex-1 text-sm"
              >
                {submitting ? 'Saving…' : '✅ Log Consumption'}
              </button>
              <button
                onClick={() => setShowConsumeModal(false)}
                className="btn-secondary flex-1 text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ItemBatchesDrawer;
