import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { categoryOptions, unitOptions } from '../../utils/mockData';
import { todayISO } from '../../utils/dateUtils';
import { getDaysLeft } from '../../utils/expiryUtils';
import { Save, X, ShoppingCart } from 'lucide-react';

const statusOptions = [
  { value: 'active',    label: 'Active'    },
  { value: 'consumed',  label: 'Consumed'  },
  { value: 'discarded', label: 'Discarded' },
];

const ItemForm = ({ initialValues = {}, onSubmit, loading = false, isEdit = false }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name:              initialValues.name             || '',
    category:          initialValues.category         || 'Dairy',
    quantity:          initialValues.quantity         || 1,
    currentQuantity:   initialValues.currentQuantity  !== undefined ? initialValues.currentQuantity : (initialValues.quantity || 1),
    unit:              initialValues.unit             || 'Pieces',
    entryDate:         initialValues.entryDate        || todayISO(),
    expiryDate:        initialValues.expiryDate       || '',
    notes:             initialValues.notes            || '',
    status:            initialValues.status           || 'active',
    minQuantity:       initialValues.minQuantity      !== undefined ? initialValues.minQuantity : 1,
    autoAddToGrocery:  initialValues.autoAddToGrocery !== undefined ? initialValues.autoAddToGrocery : true,
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const setToggle = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.checked }));

  // In Add mode, quantity and currentQuantity must stay in sync
  const handleQuantityChange = (e) => {
    const val = e.target.value;
    setForm(f => ({
      ...f,
      quantity: val,
      // Only mirror to currentQuantity in Add mode (not Edit, where they diverge)
      ...(!isEdit && { currentQuantity: val }),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Item name is required';
    if (!form.expiryDate)  errs.expiryDate = 'Expiry date is required';
    if (form.expiryDate && form.entryDate && form.expiryDate < form.entryDate)
      errs.expiryDate = 'Expiry date must be after entry date';
    if (Number(form.quantity) <= 0) errs.quantity = 'Cannot add 0 quantity — must be at least 1';
    if (isEdit && Number(form.currentQuantity) < 0) errs.currentQuantity = 'Current quantity cannot be negative';
    if (Number(form.minQuantity) < 0) errs.minQuantity = 'Minimum quantity cannot be negative';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      quantity:        Number(form.quantity),
      currentQuantity: Number(form.currentQuantity),
      minQuantity:     Number(form.minQuantity),
    });
  };

  const daysPreview   = form.expiryDate ? getDaysLeft(form.expiryDate) : null;
  const previewColor  = daysPreview === null ? '' :
    daysPreview < 0   ? 'text-red-500' :
    daysPreview <= 5  ? 'text-amber-600' : 'text-green-600';

  const isBelowMin = Number(form.currentQuantity) <= Number(form.minQuantity);

  return (
    <form onSubmit={handleSubmit} className="space-y-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">

        {/* Item Name */}
        <div className="md:col-span-2">
          <Input
            label="Item Name *"
            placeholder="e.g. Whole Milk, Greek Yogurt..."
            value={form.name}
            onChange={set('name')}
            error={errors.name}
            success={form.name.length > 2 && !errors.name}
          />
        </div>

        {/* Category */}
        <Select
          label="Category *"
          value={form.category}
          onChange={set('category')}
          options={categoryOptions}
        />

        {/* Status (edit only) */}
        {isEdit && (
          <Select
            label="Status"
            value={form.status}
            onChange={set('status')}
            options={statusOptions}
          />
        )}

        {/* Current Quantity */}
        <div className="mb-4">
          <label className="input-label">{isEdit ? 'Current Quantity *' : 'Quantity *'}</label>
          <input
            type="number"
            value={isEdit ? form.currentQuantity : form.quantity}
            min={0}
            onChange={isEdit ? set('currentQuantity') : handleQuantityChange}
            className={`input-field ${((isEdit ? errors.currentQuantity : errors.quantity) ? 'border-red-300 ring-red-100 focus:border-red-400 focus:ring-red-200' : '')}`}
          />
          {(isEdit ? errors.currentQuantity : errors.quantity) && (
            <p className="text-xs text-red-500 mt-1">{isEdit ? errors.currentQuantity : errors.quantity}</p>
          )}
          {isEdit && isBelowMin && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              ⚠️ This item is below minimum — it's in your grocery list.
            </p>
          )}
        </div>

        {/* Unit */}
        <Select
          label="Unit"
          value={form.unit}
          onChange={set('unit')}
          options={unitOptions}
        />

        {/* Entry Date */}
        <div className="mb-4">
          <label className="input-label">Entry Date</label>
          <input type="date" value={form.entryDate} onChange={set('entryDate')} className="input-field" />
        </div>

        {/* Expiry Date */}
        <div className="mb-4">
          <label className="input-label">Expiry Date *</label>
          <input
            type="date"
            value={form.expiryDate}
            onChange={set('expiryDate')}
            className={`input-field ${errors.expiryDate ? 'error' : ''}`}
            min={form.entryDate}
          />
          {errors.expiryDate && <p className="input-error-msg">{errors.expiryDate}</p>}
        </div>

        {/* Notes */}
        <div className="md:col-span-2 mb-4">
          <label className="input-label">Notes (optional)</label>
          <textarea
            value={form.notes}
            onChange={set('notes')}
            rows={3}
            placeholder="Any additional information..."
            className="input-field resize-none"
          />
        </div>
      </div>

      {/* Expiry Preview */}
      {daysPreview !== null && (
        <div className={`p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2 ${previewColor}`}>
          <span className="text-lg">{daysPreview < 0 ? '⚠️' : daysPreview <= 5 ? '🟡' : '🟢'}</span>
          <span className="font-semibold text-sm">
            {daysPreview < 0
              ? `Already expired ${Math.abs(daysPreview)} day(s) ago`
              : daysPreview === 0 ? 'Expires today!'
              : `This item will expire in ${daysPreview} day(s)`}
          </span>
        </div>
      )}

      {/* ── Smart Grocery Section ─────────────────────────────────── */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart size={16} className="text-primary" />
          <h3 className="font-heading font-semibold text-text-dark text-sm">Smart Grocery Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {/* Min Quantity */}
          <div className="mb-4">
            <label className="input-label">Minimum Quantity Threshold</label>
            <input
              type="number"
              value={form.minQuantity}
              min={0}
              onChange={set('minQuantity')}
              className={`input-field ${errors.minQuantity ? 'border-red-300 ring-red-100 focus:border-red-400 focus:ring-red-200' : ''}`}
              placeholder="e.g. 1"
            />
            {errors.minQuantity && <p className="text-xs text-red-500 mt-1">{errors.minQuantity}</p>}
          </div>

          {/* Auto-add toggle */}
          <div className="mb-4 flex flex-col justify-center">
            <label className="input-label">Auto-add to Grocery when Low</label>
            <label className="flex items-center gap-3 cursor-pointer mt-1">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={form.autoAddToGrocery}
                  onChange={setToggle('autoAddToGrocery')}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm text-text-muted">{form.autoAddToGrocery ? 'Enabled' : 'Disabled'}</span>
            </label>
          </div>
        </div>

        <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          💡 We'll automatically add this to your grocery list when quantity falls below the threshold.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-5">
        <Button type="submit" variant="primary" loading={loading} icon={Save} size="lg">
          {isEdit ? 'Save Changes' : 'Add to Pantry'}
        </Button>
        <Button type="button" variant="ghost" icon={X} onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ItemForm;
