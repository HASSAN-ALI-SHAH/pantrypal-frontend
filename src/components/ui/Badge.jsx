const Badge = ({ label, color = 'blue', pulse = false, icon, className = '' }) => {
  const colorMap = {
    red: 'badge-red', amber: 'badge-amber', green: 'badge-green',
    blue: 'badge-blue', gray: 'badge-gray', purple: 'badge-purple',
  };
  return (
    <span className={`badge ${colorMap[color] || 'badge-blue'} ${pulse ? 'badge-pulse' : ''} ${className}`}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
};

export default Badge;
