import { useNavigate } from 'react-router-dom';
import { Edit2, CheckCircle, Trash2, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import ExpiryBadge from './ExpiryBadge';
import { formatDate } from '../../utils/dateUtils';
import { categoryOptions } from '../../utils/mockData';

const catIconMap = Object.fromEntries(categoryOptions.map(c => [c.value, c.icon]));

const ItemTable = ({ items, onConsume, onDelete, sortBy, onSort, selectedIds, onSelect, onSelectAll }) => {
  const navigate = useNavigate();
  const allSelected = items.length > 0 && selectedIds?.length === items.length;

  const SortBtn = ({ field, children }) => (
    <button
      onClick={() => onSort?.(field)}
      className={`flex items-center gap-1 hover:text-primary transition-colors ${sortBy === field ? 'text-primary font-bold' : ''}`}
    >
      {children}
      <ArrowUpDown size={12} />
    </button>
  );

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {onSelect && (
              <th className="w-10">
                <input type="checkbox" checked={allSelected} onChange={e => onSelectAll?.(e.target.checked)} className="rounded" />
              </th>
            )}
            <th><SortBtn field="name">Item Name</SortBtn></th>
            <th><SortBtn field="category">Category</SortBtn></th>
            <th>Quantity</th>
            <th><SortBtn field="expiry">Expiry Date</SortBtn></th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group"
            >
              {onSelect && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds?.includes(item.id) || false}
                    onChange={e => onSelect?.(item.id, e.target.checked)}
                    className="rounded"
                  />
                </td>
              )}
              <td>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{catIconMap[item.category] || '📦'}</span>
                  <span className="font-medium text-text-dark">{item.name}</span>
                </div>
              </td>
              <td><span className="text-text-muted">{item.category}</span></td>
              <td>
                <span className="font-mono text-sm text-text-dark">{item.quantity} {item.unit}</span>
              </td>
              <td>
                <span className="font-mono text-sm text-text-dark">{formatDate(item.expiryDate)}</span>
              </td>
              <td>
                <ExpiryBadge item={item} />
              </td>
              <td>
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigate(`/edit-item/${item.id}`)}
                    className="p-1.5 rounded-lg text-primary hover:bg-blue-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onConsume?.(item.id)}
                    className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                    title="Mark consumed"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button
                    onClick={() => onDelete?.(item.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
