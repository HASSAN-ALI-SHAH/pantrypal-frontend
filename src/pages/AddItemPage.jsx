import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePantry } from '../context/PantryContext';
import ItemForm from '../components/pantry/ItemForm';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const AddItemPage = () => {
  const { addItem } = usePantry();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await addItem(data);
      toast.success(`${data.name} added to your pantry! 🎉`);
      navigate('/pantry');
    } catch (err) {
      toast.error('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-blue-sm">
            <Plus size={20} className="text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-text-dark">Add New Item</h1>
        </div>
        <p className="text-text-muted">Fill in the details below to add a food item to your pantry.</p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card p-8">
          <ItemForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-primary font-semibold mb-2">💡 Pro Tips</p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Check the "Best Before" date on packaging for the expiry date</li>
            <li>• Add notes like "opened on Jan 15" for perishables</li>
            <li>• Set shorter expiry for items opened vs. sealed</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default AddItemPage;
