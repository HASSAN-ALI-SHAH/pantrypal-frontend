import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Grid, List, Trash2, CheckCircle } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import ItemCard from '../components/pantry/ItemCard';
import ItemTable from '../components/pantry/ItemTable';
import ItemBatchesDrawer from '../components/pantry/ItemBatchesDrawer';
import SearchBar from '../components/pantry/SearchBar';
import CategoryFilter from '../components/pantry/CategoryFilter';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import { categoryOptions } from '../utils/mockData';
import { sortItems, filterByStatus } from '../utils/expiryUtils';
import toast from 'react-hot-toast';

const PantryPage = () => {
  const { items, markConsumed, markDiscarded, deleteItem, bulkConsume, bulkDelete } = usePantry();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');
  const [view, setView] = useState('grid');
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [batchDrawerItem, setBatchDrawerItem] = useState(null); // { item, initialTab }
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const activeItems = items.filter(i => i.status === 'active');

  const filtered = useMemo(() => {
    let res = filterByStatus(activeItems, activeStatus);
    if (activeCategory !== 'all') res = res.filter(i => i.category === activeCategory);
    if (search) res = res.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return sortItems(res, sortBy);
  }, [activeItems, activeStatus, activeCategory, search, sortBy]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = paginated.length < filtered.length;

  const handleConsume = (id) => { markConsumed(id); toast.success('Marked as consumed! ✅'); };
  const handleDiscard = (id) => { markDiscarded(id); toast('Marked as discarded', { icon: '🗑️' }); };
  const handleDelete = (id) => { deleteItem(id); setDeleteTarget(null); toast.success('Item deleted'); };
  const handleBulkConsume = () => { bulkConsume(selectedIds); setSelectedIds([]); toast.success(`${selectedIds.length} items marked as consumed`); };
  const handleBulkDelete = () => { bulkDelete(selectedIds); setSelectedIds([]); toast.success(`${selectedIds.length} items deleted`); };

  const handleSelect = (id, checked) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };
  const handleSelectAll = (checked) => {
    setSelectedIds(checked ? filtered.map(i => i.id) : []);
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-dark">My Pantry</h1>
          <p className="text-text-muted mt-1">{activeItems.length} active item{activeItems.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => navigate('/add-item')}>Add Item</Button>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-card p-4 mb-6 space-y-4">
        <div className="flex gap-3 flex-wrap">
          <SearchBar value={search} onChange={s => { setSearch(s); setPage(1); }} className="flex-1 min-w-48" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field !mb-0 w-auto text-sm">
            <option value="expiry">Sort: Expiry Date</option>
            <option value="name">Sort: Name</option>
            <option value="category">Sort: Category</option>
            <option value="dateAdded">Sort: Date Added</option>
          </select>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}><Grid size={16} /></button>
            <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}><List size={16} /></button>
          </div>
        </div>
        <CategoryFilter
          categories={categoryOptions}
          activeCategory={activeCategory}
          onCategoryChange={c => { setActiveCategory(c); setPage(1); }}
          activeStatus={activeStatus}
          onStatusChange={s => { setActiveStatus(s); setPage(1); }}
        />
      </motion.div>

      {/* Results count */}
      {search && (
        <p className="text-sm text-text-muted mb-4">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"</p>
      )}

      {/* Item Grid / List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="No items found"
          description={search ? `No items match "${search}"` : 'Your pantry is empty in this category.'}
          actionLabel="Add Item"
          onAction={() => navigate('/add-item')}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {paginated.map((item, i) => (
              <ItemCard
                key={item.id}
                item={item}
                index={i}
                onConsume={handleConsume}
                onDiscard={handleDiscard}
                onDelete={(id) => setDeleteTarget(id)}
                onViewBatches={(item, initialTab) => setBatchDrawerItem({ item, initialTab })}
              />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
          <ItemTable
            items={lays}
            sortBy={sortBy}
            onSort={setSortBy}
            onConsume={handleConsume}
            onDelete={(id) => setDeleteTarget(id)}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
          />
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mb-6">
          <Button variant="outline" onClick={() => setPage(p => p + 1)}>
            Load More ({filtered.length - paginated.length} remaining)
          </Button>
        </div>
      )}

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-2xl border border-gray-100 px-6 py-3 flex items-center gap-4 z-50"
          >
            <span className="text-sm font-semibold text-text-dark">{selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''} selected</span>
            <div className="w-px h-5 bg-gray-200" />
            <button onClick={handleBulkConsume} className="flex items-center gap-1.5 text-sm text-green-600 font-semibold hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">
              <CheckCircle size={15} /> Mark Consumed
            </button>
            <button onClick={handleBulkDelete} className="flex items-center gap-1.5 text-sm text-red-500 font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
              <Trash2 size={15} /> Delete
            </button>
            <button onClick={() => setSelectedIds([])} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget)}
        title="Delete Item?"
        message="This action cannot be undone. The item will be permanently removed from your pantry."
        confirmLabel="Delete"
      />

      {/* Purchase Batch & Consumption History Drawer */}
      <ItemBatchesDrawer
        item={batchDrawerItem?.item ?? null}
        initialTab={batchDrawerItem?.initialTab ?? 'purchases'}
        onClose={() => setBatchDrawerItem(null)}
      />
    </div>
  );
};

export default PantryPage;
