import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';

const BLUE_SHADES = ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#BAE6FD', '#DBEAFE'];

const WasteBarChart = ({ data = [] }) => {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-text-muted text-sm">No data available</div>
  );
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0', fontFamily: 'DM Sans', fontSize: 12 }}
          cursor={{ fill: 'rgba(59,130,246,0.06)' }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive animationDuration={900}>
          {data.map((_, i) => (
            <Cell key={i} fill={BLUE_SHADES[i % BLUE_SHADES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WasteBarChart;
