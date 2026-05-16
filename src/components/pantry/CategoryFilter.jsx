const tabs = [
  { value: 'all',           label: 'All' },
  { value: 'fresh',         label: '🟢 Fresh' },
  { value: 'expiring-soon', label: '🟡 Expiring Soon' },
  { value: 'expired',       label: '🔴 Expired' },
];

const CategoryFilter = ({ categories = [], activeCategory, onCategoryChange, activeStatus, onStatusChange }) => (
  <div className="flex flex-wrap gap-3">
    {/* Category pills */}
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-primary text-white shadow-blue-sm' : 'bg-white text-text-muted border border-gray-200 hover:border-primary-light hover:text-primary'}`}
      >
        All Categories
      </button>
      {categories.map(cat => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeCategory === cat.value ? 'bg-primary text-white shadow-blue-sm' : 'bg-white text-text-muted border border-gray-200 hover:border-primary-light hover:text-primary'}`}
        >
          <span>{cat.icon}</span>
          {cat.value}
        </button>
      ))}
    </div>

    {/* Status tabs */}
    {onStatusChange && (
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl ml-auto">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => onStatusChange(t.value)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${activeStatus === t.value ? 'bg-white text-primary shadow-sm' : 'text-text-muted hover:text-text-dark'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default CategoryFilter;
