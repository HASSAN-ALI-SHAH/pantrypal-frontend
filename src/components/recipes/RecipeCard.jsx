import { motion } from 'framer-motion';
import { Clock, ChefHat, Star } from 'lucide-react';

const difficultyConfig = {
  Easy:   { color: '#10B981', bg: '#ECFDF5' },
  Medium: { color: '#F59E0B', bg: '#FFFBEB' },
  Hard:   { color: '#EF4444', bg: '#FEF2F2' },
};

const RecipeCard = ({ recipe, onView, index = 0 }) => {
  const { name, ingredients = [], matchCount = 0, matchedIngredients = [], time, difficulty, emoji } = recipe;
  const diff = difficultyConfig[difficulty] || difficultyConfig.Easy;
  const matchPct = ingredients.length > 0 ? Math.round((matchCount / ingredients.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(29, 78, 216, 0.15)' }}
      className="bg-white rounded-2xl p-5 shadow-card cursor-default flex flex-col"
      style={{ borderLeft: '4px solid #1D4ED8' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="font-heading font-bold text-text-dark text-base leading-tight">{name}</h3>
        </div>
        {/* Match % pill */}
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: '#EFF6FF', color: '#1D4ED8' }}
        >
          {matchCount}/{ingredients.length} match
        </span>
      </div>

      {/* Match bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4">
        <div
          className="h-1.5 rounded-full transition-all"
          style={{ width: `${matchPct}%`, background: matchPct >= 60 ? '#10B981' : '#3B82F6' }}
        />
      </div>

      {/* Ingredients */}
      <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
        {ingredients.map((ingObj, i) => {
          const ingName = typeof ingObj === 'string' ? ingObj : (ingObj.ingredientName || 'Unknown');
          const isMatched = (matchedIngredients || []).includes(ingName);
          return (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={
                isMatched
                  ? { background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }
                  : { background: '#F3F4F6', color: '#6B7280' }
              }
            >
              {isMatched ? '⚡ ' : ''}{ingName}
            </span>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          {/* Time */}
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock size={12} /> {time}
          </span>
          {/* Difficulty */}
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: diff.bg, color: diff.color }}
          >
            {difficulty}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onView(recipe)}
          className="btn-primary text-xs px-3 py-1.5"
        >
          View Recipe
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
