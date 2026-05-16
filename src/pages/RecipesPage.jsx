import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChefHat, SlidersHorizontal, RefreshCw } from 'lucide-react';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeModal from '../components/recipes/RecipeModal';

const API_URL = 'https://pantrypal-backend-wine.vercel.app/api';
const getToken = () => localStorage.getItem('pantrypal_token');

const FILTERS = ['All Recipes', 'Best Match', 'Easy Only', 'Under 15 Mins'];

const parseMinutes = (timeStr) => {
  const m = parseInt(timeStr);
  return isNaN(m) ? 99 : m;
};

const RecipesPage = () => {
  const [activeFilter, setActiveFilter] = useState('Best Match');
  const [sortBy, setSortBy] = useState('match');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data from API
  const [suggestions, setSuggestions] = useState([]);   // near-expiry matched
  const [allRecipes, setAllRecipes] = useState([]);       // full catalog
  const [nearExpiryItems, setNearExpiryItems] = useState([]);
  const [error, setError] = useState(null);

  // Fetch suggestions (near-expiry matched recipes)
  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      };

      const [sugRes, allRes] = await Promise.all([
        fetch(`${API_URL}/recipes/suggestions`, { headers }),
        fetch(`${API_URL}/recipes`, { headers }),
      ]);

      const sugData = await sugRes.json();
      const allData = await allRes.json();

      if (sugData.success) {
        setSuggestions(sugData.recipes || []);
        setNearExpiryItems(sugData.nearExpiryItems || []);
      }
      if (allData.success) {
        setAllRecipes(allData.recipes || []);
      }
    } catch (err) {
      setError('Failed to load recipes. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuggestions(); }, []);

  // Filter and sort display recipes
  const displayRecipes = (() => {
    // Base: depends on active filter
    let base = activeFilter === 'All Recipes'
      ? allRecipes.map(r => {
          const matched = suggestions.find(s => s.id === r.id);
          return matched || { ...r, matchCount: 0, matchPercentage: 0 };
        })
      : suggestions; // Best Match / Easy Only / Under 15 Mins all start from suggestions

    if (activeFilter === 'Easy Only')       base = base.filter(r => r.difficulty === 'Easy');
    if (activeFilter === 'Under 15 Mins')  base = base.filter(r => parseMinutes(r.time) <= 15);
    if (activeFilter === 'Best Match')     base = base.filter(r => r.matchCount > 0);

    return [...base].sort((a, b) => {
      if (sortBy === 'match') return (b.matchCount || 0) - (a.matchCount || 0);
      if (sortBy === 'time')  return parseMinutes(a.time) - parseMinutes(b.time);
      if (sortBy === 'difficulty') {
        const order = { Easy: 1, Medium: 2, Hard: 3 };
        return (order[a.difficulty] || 2) - (order[b.difficulty] || 2);
      }
      return 0;
    });
  })();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-blue-sm">
              <ChefHat size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-text-dark">Recipe Suggestions</h1>
              <p className="text-text-muted text-sm mt-0.5">Smart recipes based on items expiring soon</p>
            </div>
          </div>
          <button onClick={fetchSuggestions} className="btn-secondary text-sm flex items-center gap-2">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Near-Expiry Banner */}
      <motion.div
        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 rounded-2xl p-5 overflow-hidden"
        style={{
          background: nearExpiryItems.length > 0
            ? 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)'
            : 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        }}
      >
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{nearExpiryItems.length > 0 ? '⚡' : '✅'}</span>
          <div>
            <h2 className="font-heading font-bold text-white text-lg">
              {nearExpiryItems.length > 0
                ? `Use These ${nearExpiryItems.length} Item${nearExpiryItems.length !== 1 ? 's' : ''} Before They Expire!`
                : 'All items are fresh! No urgent recipes needed.'}
            </h2>
            {nearExpiryItems.length > 0 && (
              <p className="text-white/70 text-sm mt-0.5">{suggestions.length} recipe{suggestions.length !== 1 ? 's' : ''} matched</p>
            )}
          </div>
        </div>
        {nearExpiryItems.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {nearExpiryItems.map(item => (
              <span key={item.id} className="text-sm px-3 py-1.5 rounded-full font-medium"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
                🍽️ {item.name} — {item.daysLeft < 0 ? 'expired' : item.daysLeft === 0 ? 'today' : `${item.daysLeft}d`}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-card p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className="text-sm px-4 py-1.5 rounded-full font-semibold transition-all"
              style={activeFilter === f ? { background: '#1D4ED8', color: '#fff' } : { background: '#F3F4F6', color: '#6B7280' }}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-text-muted" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="input-field py-1.5 text-sm" style={{ width: 'auto', minWidth: '140px' }}>
            <option value="match">By Match %</option>
            <option value="time">By Time</option>
            <option value="difficulty">By Difficulty</option>
          </select>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <RefreshCw size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-text-muted">Loading recipes...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <button onClick={fetchSuggestions} className="mt-4 btn-primary text-sm">Try Again</button>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && !error && displayRecipes.length === 0 && (activeFilter !== 'Best Match' || nearExpiryItems.length === 0) && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-card p-16 text-center">
          <span className="text-5xl block mb-4">🍽️</span>
          <p className="font-heading font-semibold text-text-dark text-lg mb-2">No recipes found</p>
          <p className="text-text-muted text-sm max-w-sm mx-auto">
            {activeFilter === 'Best Match'
              ? 'No items are expiring soon. Try "All Recipes" to browse the full catalog.'
              : 'No recipes match this filter. Try a different filter.'}
          </p>
          <button onClick={() => setActiveFilter('All Recipes')} className="inline-block mt-5 btn-primary text-sm">
            Show All Recipes
          </button>
        </motion.div>
      )}

      {/* Best Match View: Grouped by expiring item */}
      {!loading && !error && activeFilter === 'Best Match' && nearExpiryItems.length > 0 && (
        <div className="space-y-8 mb-6">
          {nearExpiryItems.map((item) => {
            const itemWords = item.name.toLowerCase().split(/[\s-]+/).filter(w => w.length > 2);
            const itemRecipes = displayRecipes.filter(r => 
              r.matchedIngredients && r.matchedIngredients.some(ing => {
                const ingLower = ing.toLowerCase();
                return ingLower.includes(item.name.toLowerCase()) || 
                       item.name.toLowerCase().includes(ingLower) ||
                       itemWords.some(w => ingLower.includes(w) || w.includes(ingLower));
              })
            );
            
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-card p-6 border-t-4 border-primary">
                <h3 className="font-heading text-xl font-bold text-text-dark mb-4 flex items-center gap-2">
                  <span>🥘</span> Recipes for <span className="text-primary capitalize">{item.name}</span>
                </h3>
                {itemRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {itemRecipes.map((recipe, i) => (
                      <RecipeCard key={recipe.id} recipe={recipe} onView={setSelectedRecipe} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-text-muted">No recipes found in the catalog containing {item.name}.</p>
                    <button onClick={() => setActiveFilter('All Recipes')} className="text-primary text-sm mt-2 hover:underline">
                      Browse all recipes
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Normal Grid for other filters */}
      {!loading && !error && displayRecipes.length > 0 && (activeFilter !== 'Best Match' || nearExpiryItems.length === 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
          {displayRecipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} onView={setSelectedRecipe} index={i} />
          ))}
        </div>
      )}

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeModal recipe={selectedRecipe} nearExpiryItems={nearExpiryItems} onClose={() => setSelectedRecipe(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecipesPage;
