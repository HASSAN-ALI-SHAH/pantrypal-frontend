import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, ChevronDown, User, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePantry } from '../../context/PantryContext';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { items, alerts } = usePantry();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const criticalAlerts = alerts.filter(a => !a.dismissed).slice(0, 5);
  const alertCount = alerts.filter(a => !a.dismissed).length;

  const searchResults = search.length > 1
    ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) { setSearchOpen(false); setSearch(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="topbar">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pantry items..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSearchOpen(true); }}
            onFocus={() => setSearchOpen(true)}
            className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light/30 focus:border-primary-light transition-all"
          />
          {search && (
            <button onClick={() => { setSearch(''); setSearchOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-scale-in">
            {searchResults.map(item => (
              <button
                key={item.id}
                onClick={() => { navigate(`/edit-item/${item.id}`); setSearchOpen(false); setSearch(''); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left"
              >
                <span className="text-xl">{item.category === 'Dairy' ? '🥛' : item.category === 'Vegetables' ? '🥦' : item.category === 'Fruits' ? '🍎' : item.category === 'Grains' ? '🌾' : item.category === 'Beverages' ? '🧃' : item.category === 'Meat' ? '🥩' : '📦'}</span>
                <div>
                  <p className="text-sm font-medium text-text-dark">{item.name}</p>
                  <p className="text-xs text-text-muted">{item.category}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(v => !v); setUserMenuOpen(false); }}
            className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center px-0.5 animate-pulse">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="font-heading font-semibold text-sm text-text-dark">Notifications</span>
                <span className="badge badge-red">{alertCount} alerts</span>
              </div>
              {criticalAlerts.length === 0 ? (
                <div className="px-4 py-6 text-center text-text-muted text-sm">All clear! No alerts.</div>
              ) : (
                criticalAlerts.map(alert => (
                  <div key={alert.id} className="px-4 py-3 border-b border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => { navigate('/alerts'); setNotifOpen(false); }}>
                    <div className="flex items-start gap-2.5">
                      <span className="text-lg mt-0.5">{alert.status.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-text-dark">{alert.itemName}</p>
                        <p className="text-xs text-text-muted">
                          {alert.daysLeft < 0 ? `Expired ${Math.abs(alert.daysLeft)}d ago` :
                            alert.daysLeft === 0 ? 'Expires today!' : `Expires in ${alert.daysLeft}d`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <button onClick={() => { navigate('/alerts'); setNotifOpen(false); }} className="w-full py-3 text-center text-primary text-sm font-semibold hover:bg-blue-50 transition-colors">
                View all alerts →
              </button>
            </div>
          )}
        </div>

        {/* User avatar dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => { setUserMenuOpen(v => !v); setNotifOpen(false); }}
            className="flex items-center gap-2 p-1.5 pl-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-light to-primary flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-text-dark max-w-[100px] truncate">{user?.name}</span>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-scale-in">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-text-dark truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate">{user?.email}</p>
              </div>
              <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-dark hover:bg-gray-50 transition-colors">
                <User size={15} className="text-gray-400" /> Profile
              </button>
              <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-text-dark hover:bg-gray-50 transition-colors">
                <Settings size={15} className="text-gray-400" /> Settings
              </button>
              <div className="border-t border-gray-100" />
              <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
