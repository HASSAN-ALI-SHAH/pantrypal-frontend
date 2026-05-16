import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, ChefHat } from 'lucide-react';
import { usePantry } from '../../context/PantryContext';
import toast from 'react-hot-toast';

const difficultyConfig = {
  Easy:   { color: '#10B981', bg: '#ECFDF5' },
  Medium: { color: '#F59E0B', bg: '#FFFBEB' },
  Hard:   { color: '#EF4444', bg: '#FEF2F2' },
};

const RecipeModal = ({ recipe, nearExpiryItems, onClose }) => {
  const { markConsumed } = usePantry();

  if (!recipe) return null;

  const { name, ingredients = [], instructions = [], time, difficulty, emoji, matchedIngredients = [] } = recipe;
  const diff = difficultyConfig[difficulty] || difficultyConfig.Easy;

  const instructionList = Array.isArray(instructions) 
    ? instructions 
    : (typeof instructions === 'string' ? instructions.split('\n').filter(Boolean) : []);

  const handleMarkConsumed = () => {
    const toConsume = nearExpiryItems.filter((item) => {
      const itemWords = item.name.toLowerCase().split(/[\s-]+/).filter(w => w.length > 2);
      return matchedIngredients.some((ing) => {
        const ingLower = ing.toLowerCase();
        return item.name.toLowerCase().includes(ingLower) || 
               ingLower.includes(item.name.toLowerCase()) ||
               itemWords.some(w => ingLower.includes(w) || w.includes(ingLower));
      });
    });
    toConsume.forEach((item) => markConsumed(item.id));
    toast.success(`Marked ${toConsume.length} ingredient(s) as consumed! ✅`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: 'rgba(30, 58, 95, 0.65)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Blue Header */}
          <div className="bg-gradient-to-r from-primary to-blue-500 p-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                {emoji}
              </div>
              <div>
                <h2 className="font-heading font-bold text-white text-xl">{name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/80 text-xs flex items-center gap-1">
                    <Clock size={12} /> {time}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: diff.bg, color: diff.color }}
                  >
                    {difficulty}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 p-6">
            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="font-heading font-semibold text-text-dark mb-3 flex items-center gap-2">
                <ChefHat size={16} className="text-primary" /> Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingObj, idx) => {
                  const ingName = typeof ingObj === 'string' ? ingObj : (ingObj.ingredientName || 'Unknown');
                  const isMatched = matchedIngredients.includes(ingName);
                  return (
                    <span
                      key={idx}
                      className="text-sm px-3 py-1 rounded-full font-medium"
                      style={
                        isMatched
                          ? { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }
                          : { background: '#F3F4F6', color: '#374151' }
                      }
                    >
                      {isMatched ? '🟡 ' : ''}{ingName}
                    </span>
                  );
                })}
              </div>
              {matchedIngredients.length > 0 && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  🟡 Highlighted ingredients are near expiry in your pantry
                </p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h3 className="font-heading font-semibold text-text-dark mb-3">
                📋 Step-by-Step Instructions
              </h3>
              <ol className="space-y-3">
                {instructionList.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: '#1D4ED8' }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm text-text-muted leading-relaxed pt-0.5">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            {matchedIngredients.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMarkConsumed}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Mark Ingredients as Consumed
              </motion.button>
            )}
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RecipeModal;
