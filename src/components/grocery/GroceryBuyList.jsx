import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, ChevronDown, ChevronUp, CheckCheck, Trash2 } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';
import GroceryItem from './GroceryItem';
import { categoryOptions, unitOptions } from '../../utils/mockData';

const GroceryBuyList = () => {
  const { groceryList, removeFromGroceryList, purchaseGroceryItem } = usePantry();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({ itemName: '', category: 'Dairy', suggestedQuantity: 1, unit: 'Pieces' });
  // State for the "how much did you buy?" modal
  const [buyModal, setBuyModal] = useState(null); // { id, itemName, unit }
  const [buyForm, setBuyForm] = useState({ qty: '', entryDate: '', expiryDate: '' });

  const { addToGroceryList, bulkMarkPurchased, bulkRemoveGrocery } = usePantry();

  const unpurchased = groceryList.filter((g) => !g.purchased);
  const purchased = groceryList.filter((g) => g.purchased);

  const setF = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAddManual = () => {
    if (!form.itemName.trim()) return;
    addToGroceryList({ ...form, triggeredBy: 'manual', suggestedQuantity: Number(form.suggestedQuantity) });
    setForm({ itemName: '', category: 'Dairy', suggestedQuantity: 1, unit: 'Pieces' });
    setShowAddForm(false);
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleBulkPurchased = () => {
    // For bulk, just mark purchased without pantry update (no qty dialog)
    bulkMarkPurchased(selected);
    setSelected([]);
  };

  const handleBulkRemove = () => {
    bulkRemoveGrocery(selected);
    setSelected([]);
  };

  // Open the quantity dialog when user clicks the circle button
  const handleOpenBuyModal = (item) => {
    setBuyModal({ id: item.id, itemName: item.itemName, unit: item.unit });
    const today = new Date().toISOString().split('T')[0];
    setBuyForm({ qty: '', entryDate: today, expiryDate: '' });
  };

  const handleConfirmPurchase = async () => {
    // Sanitize: strip leading zeros, parse to float, enforce boundaries
    const raw = String(buyForm.qty).trim();
    const qty = parseFloat(raw);
    if (!Number.isFinite(qty) || qty <= 0) return;          // reject NaN, 0, negative
    const safeQty = Math.min(Math.max(qty, 0.01), 99999);   // clamp to safe range
    await purchaseGroceryItem(buyModal.id, {
      quantity: safeQty,
      entryDate: buyForm.entryDate,
      expiryDate: buyForm.expiryDate || null,
    });
    setBuyModal(null);
    setBuyForm({ qty: '', entryDate: '', expiryDate: '' });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-text-dark flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, -15, 15, -15, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
          >
            <ShoppingCart size={18} className="text-primary" />
          </motion.div>
          Items to Buy
          {unpurchased.length > 0 && (
            <span className="ml-1 text-xs bg-primary text-white rounded-full px-2 py-0.5">
              {unpurchased.length}
            </span>
          )}
        </h2>
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="btn-secondary text-sm flex items-center gap-1.5"
        >
          <Plus size={14} /> Add Manually
          {showAddForm ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Inline Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="col-span-2">
                  <label className="input-label">Item Name</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Whole Milk"
                    value={form.itemName}
                    onChange={setF('itemName')}
                  />
                </div>
                <div>
                  <label className="input-label">Category</label>
                  <select className="input-field" value={form.category} onChange={setF('category')}>
                    {categoryOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Quantity</label>
                  <input
                    type="number"
                    className="input-field"
                    min={1}
                    value={form.suggestedQuantity}
                    onChange={setF('suggestedQuantity')}
                  />
                </div>
                <div>
                  <label className="input-label">Unit</label>
                  <select className="input-field" value={form.unit} onChange={setF('unit')}>
                    {unitOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddManual} className="btn-primary text-sm flex items-center gap-2">
                  <Plus size={14} /> Add to List
                </button>
                <button onClick={() => setShowAddForm(false)} className="btn-secondary text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl mb-3"
          >
            <span className="text-sm font-semibold text-primary">{selected.length} items selected</span>
            <button onClick={handleBulkPurchased} className="btn-primary text-xs flex items-center gap-1 ml-auto">
              <CheckCheck size={13} /> Mark All Purchased
            </button>
            <button onClick={handleBulkRemove} className="btn-secondary text-xs flex items-center gap-1 border-red-200 text-red-500 hover:bg-red-50">
              <Trash2 size={13} /> Remove Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items */}
      {unpurchased.length === 0 ? (
        <div className="py-12 text-center text-text-muted">
          <span className="text-4xl mb-3 block">🎉</span>
          <p className="font-semibold">Your grocery list is empty</p>
          <p className="text-sm mt-1">Great job keeping your pantry stocked!</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {unpurchased.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onOpenBuyModal={handleOpenBuyModal}
                onRemove={(id) => removeFromGroceryList(id)}
                isSelected={selected.includes(item.id)}
                onSelect={toggleSelect}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── "How much did you buy?" Modal ── */}
      {buyModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
          >
            <h3 className="font-heading font-bold text-text-dark text-lg mb-1">🛍️ Log Purchase</h3>
            <p className="text-sm text-text-muted mb-5">
              Recording purchase of <span className="font-semibold text-text-dark">{buyModal.itemName}</span>.
              This will update your pantry stock and create a batch record.
            </p>

            {/* Quantity */}
            <label className="input-label">Quantity Bought ({buyModal.unit})</label>
            <input
              type="number"
              min="0.01"
              max="99999"
              step="any"
              autoFocus
              placeholder="e.g. 10"
              value={buyForm.qty}
              onChange={(e) => {
                // Only allow valid numeric characters (no leading zeros that produce odd values)
                const val = e.target.value;
                setBuyForm(f => ({ ...f, qty: val }));
              }}
              onBlur={(e) => {
                // On blur, sanitize the display value
                const parsed = parseFloat(e.target.value);
                if (Number.isFinite(parsed) && parsed > 0) {
                  setBuyForm(f => ({ ...f, qty: String(parsed) }));
                }
              }}
              className="input-field mb-3"
            />

            {/* Entry Date */}
            <label className="input-label">Entry / Purchase Date</label>
            <input
              type="date"
              value={buyForm.entryDate}
              onChange={(e) => setBuyForm(f => ({ ...f, entryDate: e.target.value }))}
              className="input-field mb-3"
            />

            {/* Expiry Date */}
            <label className="input-label">Expiry Date <span className="text-text-muted font-normal">(optional)</span></label>
            <input
              type="date"
              value={buyForm.expiryDate}
              onChange={(e) => setBuyForm(f => ({ ...f, expiryDate: e.target.value }))}
              className="input-field mb-5"
            />

            <div className="flex gap-2">
              <button
                onClick={handleConfirmPurchase}
                disabled={!buyForm.qty || !Number.isFinite(parseFloat(buyForm.qty)) || parseFloat(buyForm.qty) <= 0}
                className="btn-primary flex-1 text-sm"
              >
                ✅ Confirm Purchase
              </button>
              <button
                onClick={() => setBuyModal(null)}
                className="btn-secondary flex-1 text-sm"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GroceryBuyList;
