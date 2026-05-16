import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CAT_COLORS = {
  Dairy: '#2563EB', Vegetables: '#10B981', Fruits: '#EF4444',
  Grains: '#F59E0B', Beverages: '#7C3AED', Meat: '#9F1239', Other: '#64748B',
};

const CategoryPieChart = ({ data = [] }) => {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-text-muted text-sm">No items</div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={85}
          paddingAngle={2}
          dataKey="value"
          isAnimationActive
          animationDuration={900}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={CAT_COLORS[entry.name] || '#94A3B8'} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontFamily: 'DM Sans', fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
