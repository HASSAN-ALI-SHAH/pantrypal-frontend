import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBasket, AlertTriangle, CheckCircle, XCircle, Plus, Bell, BarChart3, TrendingUp, Clock, UtensilsCrossed, ShoppingCart } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/alerts/AlertBanner';
import ExpiryDonut from '../components/charts/ExpiryDonut';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import ExpiryBadge from '../components/pantry/ExpiryBadge';
import { formatDate } from '../utils/dateUtils';
import { getDaysLeft } from '../utils/expiryUtils';
import { getRecipeSuggestions } from '../utils/recipeUtils';
import toast from 'react-hot-toast';

const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      setCount(c => { if (c + step >= target) { clearInterval(timer); return target; } return c + step; });
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

const StatCard = ({ icon: Icon, label, value, color, delay, trend }) => {
  const animated = useCountUp(value);
  const colorStyles = {
    blue:   { border: '#3B82F6', bg: '#EFF6FF', icon: '#1D4ED8' },
    amber:  { border: '#F59E0B', bg: '#FFFBEB', icon: '#D97706' },
    green:  { border: '#10B981', bg: '#ECFDF5', icon: '#059669' },
    red:    { border: '#EF4444', bg: '#FEF2F2', icon: '#DC2626' },
  }[color] || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all cursor-default"
      style={{ borderLeft: `4px solid ${colorStyles.border}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: colorStyles.bg }}>
          <Icon size={22} style={{ color: colorStyles.icon }} />
        </div>
        {trend && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><TrendingUp size={10} /> {trend}</span>}
      </div>
      <div className="font-mono text-3xl font-bold text-text-dark mb-1">{animated}</div>
      <p className="text-text-muted text-sm">{label}</p>
    </motion.div>
  );
};

const Dashboard = () => {
  const { items, alerts, stats, categoryBreakdown, markConsumed, deleteItem } = usePantry();
  const { user } = useAuth();
  const navigate = useNavigate();

  const recentItems = [...items]
    .filter(i => i.status === 'active')
    .sort((a, b) => getDaysLeft(a.expiryDate) - getDaysLeft(b.expiryDate))
    .slice(0, 5);

  // Recipe preview — top 2 matched
  const topRecipes = getRecipeSuggestions(items).slice(0, 2);
  const pendingGrocery = stats.needsRestocking || 0;

  const handleConsume = (id) => { markConsumed(id); toast.success('Marked as consumed! ✅'); };
  const handleDelete  = (id) => { deleteItem(id);   toast('Item removed', { icon: '🗑️' }); };

  return (
    <div>
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-text-dark">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="text-primary">{user?.name?.split(' ')[0] || 'there'}</span> 👋
        </h1>
        <p className="text-text-muted mt-1">Here's what's happening in your pantry today.</p>
      </motion.div>

      {/* Alert Banner */}
      <AlertBanner alerts={alerts} />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBasket} label="Total Active Items" value={stats.total}    color="blue"  delay={0.05} />
        <StatCard icon={AlertTriangle}  label="Expiring Soon"      value={stats.expiring} color="amber" delay={0.10} />
        <StatCard icon={CheckCircle}    label="Fresh Items"         value={stats.fresh}    color="green" delay={0.15} />
        <StatCard icon={XCircle}        label="Expired Items"       value={stats.expired}  color="red"   delay={0.20} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-heading font-semibold text-text-dark mb-1">Expiry Status Overview</h2>
          <p className="text-text-muted text-xs mb-4">Distribution of your active pantry items</p>
          <ExpiryDonut stats={stats} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-heading font-semibold text-text-dark mb-1">Category Breakdown</h2>
          <p className="text-text-muted text-xs mb-4">Items grouped by food category</p>
          <CategoryPieChart data={categoryBreakdown} />
        </motion.div>
      </div>

      {/* ── Recipe Suggestions Preview ─────────────────────────────── */}
      {topRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
          className="bg-white rounded-2xl shadow-card mb-8 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={18} className="text-primary" />
              <div>
                <h2 className="font-heading font-semibold text-text-dark">Recipe Suggestions</h2>
                <p className="text-xs text-text-muted mt-0.5">Use expiring ingredients before they go bad</p>
              </div>
            </div>
            <Link to="/recipes" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
              View All Recipes →
            </Link>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topRecipes.map((recipe) => {
              const pct = Math.round((recipe.matchCount / recipe.ingredients.length) * 100);
              return (
                <Link key={recipe.id} to="/recipes">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all"
                    style={{ borderLeft: '3px solid #1D4ED8' }}
                  >
                    <span className="text-2xl">{recipe.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-dark text-sm truncate">{recipe.name}</p>
                      <p className="text-xs text-text-muted">{recipe.time} · {recipe.difficulty}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                      {pct}% match
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Items Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white rounded-2xl shadow-card mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-heading font-semibold text-text-dark">Items Expiring Soonest</h2>
            <p className="text-xs text-text-muted mt-0.5">Sorted by nearest expiry date</p>
          </div>
          <Link to="/pantry" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            View All <Clock size={13} />
          </Link>
        </div>

        {recentItems.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <span className="text-4xl mb-3 block">🎉</span>
            <p className="font-semibold">Your pantry is empty!</p>
            <p className="text-sm mt-1">Add your first item to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Name</th><th>Category</th><th>Quantity</th>
                  <th>Expiry Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item, i) => (
                  <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.05 }}>
                    <td><span className="font-medium text-text-dark">{item.name}</span></td>
                    <td><span className="text-text-muted">{item.category}</span></td>
                    <td><span className="font-mono text-sm">{item.quantity} {item.unit}</span></td>
                    <td><span className="font-mono text-sm">{formatDate(item.expiryDate)}</span></td>
                    <td><ExpiryBadge item={item} /></td>
                    <td>
                      <div className="flex gap-1.5">
                        <button onClick={() => navigate(`/edit-item/${item.id}`)} className="text-xs px-2 py-1 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-primary text-text-muted hover:text-primary transition-all">Edit</button>
                        <button onClick={() => handleConsume(item.id)} className="text-xs px-2 py-1 rounded-lg border border-green-100 bg-green-50 text-green-600 hover:bg-green-100 transition-all">Consumed</button>
                        <button onClick={() => handleDelete(item.id)} className="text-xs px-2 py-1 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-all">Delete</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-heading font-semibold text-text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Plus,          label: 'Add New Item',     desc: 'Add food to your pantry',          to: '/add-item',  color: 'from-blue-500 to-blue-600' },
            { icon: Bell,          label: 'View Alerts',      desc: `${alerts.length} active alerts`,   to: '/alerts',    color: 'from-amber-500 to-orange-500' },
            { icon: BarChart3,     label: 'View Reports',     desc: 'Analytics & waste stats',           to: '/reports',   color: 'from-purple-500 to-indigo-500' },
            {
              icon: ShoppingCart,
              label: pendingGrocery > 0 ? `${pendingGrocery} need restocking` : 'Pantry fully stocked!',
              desc:  pendingGrocery > 0 ? 'View your grocery list' : 'No restocking needed 🎉',
              to: '/grocery',
              color: pendingGrocery > 0 ? 'from-amber-400 to-amber-500' : 'from-green-500 to-emerald-500',
            },
          ].map(({ icon: Icon, label, desc, to, color }) => (
            <Link key={to} to={to}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-br ${color} p-5 rounded-2xl text-white cursor-pointer shadow-md hover:shadow-lg transition-shadow`}
              >
                <Icon size={24} className="mb-3 opacity-90" />
                <p className="font-heading font-bold text-base">{label}</p>
                <p className="text-white/70 text-sm">{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
