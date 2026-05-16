import { useExpiryStatus } from '../../hooks/useExpiryStatus';

const ExpiryBadge = ({ item, showIcon = true, showText = false }) => {
  const { daysLeft, status, expiryText } = useExpiryStatus(item);
  if (!status) return null;

  const isCritical = status.color === 'red';

  return (
    <span className={`badge ${status.badgeClass} ${isCritical ? 'badge-pulse' : ''}`}>
      {showIcon && <span>{status.icon}</span>}
      {showText ? expiryText : status.label}
    </span>
  );
};

export default ExpiryBadge;
