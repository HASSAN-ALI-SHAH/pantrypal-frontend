import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import ItemForm from '../components/pantry/ItemForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const EditItemPage = () => {
  const { id } = useParams();
  const { items, updateItem, deleteItem } = usePantry();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // id from URL is string; DB ids are numbers — compare both ways
  const item = items.find(i => String(i.id) === String(id));

  if (!item) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-6xl mb-4">🔍</span>
      <h2 className="font-heading text-2xl font-bold text-text-dark mb-2">Item Not Found</h2>
      <p className="text-text-muted mb-6">This pantry item doesn't exist or was already deleted.</p>
      <Button variant="primary" onClick={() => navigate('/pantry')}>Back to Pantry</Button>
    </div>
  );

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await updateItem({ ...data, id: item.id });
      toast.success('Item updated! ✅');
      navigate('/pantry');
    } catch (err) {
      toast.error('Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteItem(item.id);
      toast.success('Item deleted');
      navigate('/pantry');
    } catch (err) {
      toast.error('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center shadow-blue-sm">
            <Edit2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-text-dark">Edit Item</h1>
            <p className="text-text-muted text-sm mt-0.5">{item.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card p-8">
          <ItemForm initialValues={item} onSubmit={handleSubmit} loading={loading} isEdit />
        </div>

        {/* Danger zone */}
        <div className="mt-6 p-5 border-2 border-red-100 bg-red-50 rounded-2xl">
          <h3 className="font-heading font-semibold text-red-700 mb-1">Danger Zone</h3>
          <p className="text-red-500 text-sm mb-3">Permanently delete this item from your pantry. This cannot be undone.</p>
          <Button variant="danger" icon={Trash2} onClick={() => setShowDelete(true)}>Delete Item</Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Item?"
        message={`"${item.name}" will be permanently removed from your pantry.`}
        confirmLabel="Yes, Delete"
      />
    </motion.div>
  );
};

export default EditItemPage;
