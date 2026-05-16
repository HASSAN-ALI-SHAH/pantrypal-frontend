import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLOR_MAP = {
  'Fresh': '#10B981',
  'Expiring Soon': '#F59E0B',
  'Expired': '#EF4444',
};

const ExpiryDonut = ({ stats }) => {
  const data = [
    { name: 'Fresh',         value: stats?.fresh    || 0 },
    { name: 'Expiring Soon', value: stats?.expiring || 0 },
    { name: 'Expired',       value: stats?.expired  || 0 },
  ].filter(d => d.value > 0);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (total === 0) return (
    <div className="flex items-center justify-center h-48 text-text-muted text-sm">No active items</div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
          isAnimationActive={true}
          animationBegin={100}
          animationDuration={900}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={COLOR_MAP[entry.name]} strokeWidth={0} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontFamily: 'DM Sans' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span style={{ fontSize: 12, color: '#64748B' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpiryDonut;
