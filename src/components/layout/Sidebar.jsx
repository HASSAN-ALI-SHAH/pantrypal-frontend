import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBasket, PlusCircle,
  Bell, BarChart3, Settings, LogOut, ChefHat, UtensilsCrossed, ShoppingCart, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePantry } from '../../context/PantryContext';
import { getDaysLeft } from '../../utils/expiryUtils';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { alerts, items, groceryList } = usePantry();
  const navigate = useNavigate();

  const criticalCount   = alerts.filter(a => !a.dismissed).length;
  const nearExpiryCount = items.filter(i => i.status === 'active' && getDaysLeft(i.expiryDate) <= 3).length;
  const pendingGrocery  = groceryList.filter(g => !g.purchased).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/pantry',    icon: ShoppingBasket,  label: 'My Pantry'   },
    { to: '/add-item',  icon: PlusCircle,      label: 'Add Item'    },
    { to: '/alerts',    icon: Bell,            label: 'Alerts',     badge: criticalCount > 0 ? criticalCount : null, badgeColor: 'red' },
    { to: '/recipes',   icon: UtensilsCrossed, label: 'Recipes',    badge: nearExpiryCount > 0 ? true : null, badgeColor: 'blue', pulse: true },
    { to: '/reports',   icon: BarChart3,       label: 'Reports'     },
    { to: '/grocery',   icon: ShoppingCart,    label: 'Grocery List', badge: pendingGrocery > 0 ? pendingGrocery : null, badgeColor: 'amber' },
    { to: '/settings',  icon: Settings,        label: 'Settings'    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[99] backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center shadow-blue-sm">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <span className="font-heading font-bold text-white text-lg leading-none">PantryPal</span>
            <p className="text-white/40 text-xs mt-0.5">Food Expiry Monitor</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1">
          {navLinks.map(({ to, icon: Icon, label, badge, badgeColor, pulse }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} className="nav-icon flex-shrink-0" />
              <span className="text-sm">{label}</span>

              {/* Numeric badge */}
              {badge && badge !== true && (
                <span
                  className="ml-auto text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
                  style={{
                    background: badgeColor === 'red' ? '#EF4444' : badgeColor === 'amber' ? '#F59E0B' : '#1D4ED8',
                  }}
                >
                  {badge > 9 ? '9+' : badge}
                </span>
              )}

              {/* Pulsing blue dot (recipes when near-expiry items exist) */}
              {badge === true && pulse && (
                <span className="ml-auto relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User profile mini card */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name || 'User'}</p>
              <p className="text-white/40 text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="sidebar-nav-item w-full text-red-300 hover:text-red-200 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
