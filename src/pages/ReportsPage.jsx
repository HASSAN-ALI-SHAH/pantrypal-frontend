import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { TrendingDown, PackageCheck, PackageX, Percent, Download } from 'lucide-react';
import { usePantry } from '../context/PantryContext';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import { formatDate, monthName } from '../utils/dateUtils';
import { getDaysLeft } from '../utils/expiryUtils';

const ReportsPage = () => {
  const { items, stats, categoryBreakdown } = usePantry();
  const [dateFilter, setDateFilter] = useState('all');

  // Monthly waste (expired) summary — last 6 months
  const monthlyData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const m = (now.getMonth() - 5 + i + 12) % 12;
      const y = now.getFullYear() - (now.getMonth() - 5 + i < 0 ? 1 : 0);
      const expired = items.filter(item => {
        const d = new Date(item.expiryDate);
        return d.getMonth() === m && d.getFullYear() === y && getDaysLeft(item.expiryDate) < 0;
      }).length;
      const consumed = items.filter(item => {
        const d = new Date(item.entryDate);
        return d.getMonth() === m && d.getFullYear() === y && item.status === 'consumed';
      }).length;
      return { name: monthName(m), expired, consumed };
    });
  }, [items]);

  // Next 14 days expiry timeline
  const expiryTimeline = useMemo(() => {
    const result = {};
    items.filter(i => i.status === 'active').forEach(i => {
      const d = getDaysLeft(i.expiryDate);
      if (d >= 0 && d <= 14) {
        const key = d === 0 ? 'Today' : `Day +${d}`;
        result[key] = (result[key] || 0) + 1;
      }
    });
    return Object.entries(result).map(([name, value]) => ({ name, value })).slice(0, 14);
  }, [items]);

  const exportCSV = () => {
    const headers = ['Name', 'Category', 'Quantity', 'Unit', 'Entry Date', 'Expiry Date', 'Status', 'Days Left'];
    const rows = items.map(i => [
      i.name, i.category, i.quantity, i.unit,
      formatDate(i.entryDate), formatDate(i.expiryDate),
      i.status, getDaysLeft(i.expiryDate),
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'pantrypal-report.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const StatCard = ({ icon: Icon, label, value, color, unit = '' }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-card border-l-4 ${color}`}>
      <div className="flex items-center gap-3 mb-3">
        <Icon size={20} className="text-text-muted" />
        <span className="text-text-muted text-sm">{label}</span>
      </div>
      <div className="font-mono text-3xl font-bold text-text-dark">{value}<span className="text-base font-normal text-text-muted ml-1">{unit}</span></div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-text-dark">Reports & Analytics</h1>
          <p className="text-text-muted mt-1">Insights into your pantry habits and waste patterns.</p>
        </div>
        <button onClick={exportCSV} className="btn btn-outline gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={TrendingDown}  label="Total Items"       value={stats.total_all} color="border-blue-400" />
        <StatCard icon={PackageCheck}  label="Consumed On Time"  value={stats.consumed}  color="border-green-400" />
        <StatCard icon={PackageX}      label="Wasted / Expired"  value={stats.discarded + stats.expired} color="border-red-400" />
        <StatCard icon={Percent}       label="Waste Reduction"   value={stats.wasteReduction} unit="%" color="border-purple-400" />
      </div>

      {/* Charts 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Waste by Month */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-heading font-semibold text-text-dark mb-4">Expired vs Consumed (6 Months)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="consumed" name="Consumed" fill="#10B981" radius={[4,4,0,0]} isAnimationActive animationDuration={800} />
              <Bar dataKey="expired" name="Expired" fill="#EF4444" radius={[4,4,0,0]} isAnimationActive animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-heading font-semibold text-text-dark mb-4">Category Distribution</h2>
          <CategoryPieChart data={categoryBreakdown} />
        </div>

        {/* Expiry timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-heading font-semibold text-text-dark mb-4">Expiry Timeline (Next 14 Days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={expiryTimeline} margin={{ left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="#1D4ED8" strokeWidth={2.5}
                dot={{ fill: '#1D4ED8', r: 4 }} activeDot={{ r: 6 }}
                isAnimationActive animationDuration={1000} name="Items Expiring" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category bar (horizontal) */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-heading font-semibold text-text-dark mb-4">Items Per Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 12 }} />
              <Bar dataKey="value" name="Items" fill="#3B82F6" radius={[0,6,6,0]} isAnimationActive animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-text-dark">Full History Log</h2>
          <button onClick={exportCSV} className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <Download size={14} /> Download CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Item</th><th>Category</th><th>Added</th><th>Expiry</th><th>Status</th><th>Days Left</th>
              </tr>
            </thead>
            <tbody>
              {items.slice(0, 20).map((item, i) => {
                const daysLeft = getDaysLeft(item.expiryDate);
                return (
                  <tr key={item.id} style={{ animationDelay: `${i * 30}ms` }}>
                    <td className="font-medium">{item.name}</td>
                    <td className="text-text-muted">{item.category}</td>
                    <td className="font-mono text-sm">{formatDate(item.entryDate)}</td>
                    <td className="font-mono text-sm">{formatDate(item.expiryDate)}</td>
                    <td>
                      <span className={`badge ${item.status === 'consumed' ? 'badge-green' : item.status === 'discarded' ? 'badge-gray' : 'badge-blue'} capitalize`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <span className={`font-mono text-sm font-bold ${daysLeft < 0 ? 'text-red-500' : daysLeft <= 5 ? 'text-amber-600' : 'text-green-600'}`}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d ago` : `${daysLeft}d`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
