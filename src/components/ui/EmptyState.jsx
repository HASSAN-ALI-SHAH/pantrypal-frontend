import Button from './Button';
import { Plus } from 'lucide-react';

const EmptyState = ({
  icon = '🥦',
  title = 'Nothing here yet',
  description = 'Start by adding your first item.',
  actionLabel,
  onAction,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
    <div className="text-6xl mb-4 animate-float">{icon}</div>
    <h3 className="font-heading text-xl font-semibold text-text-dark mb-2">{title}</h3>
    <p className="text-text-muted text-sm max-w-xs mb-6">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" icon={Plus} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
