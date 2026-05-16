import AlertItem from './AlertItem';
import EmptyState from '../ui/EmptyState';

const AlertPanel = ({ alerts, onConsume, onDismiss }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <EmptyState
        icon="🔔"
        title="No alerts here"
        description="All your items are in great shape. Keep it up!"
      />
    );
  }
  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <AlertItem
          key={alert.id}
          alert={alert}
          onConsume={onConsume}
          onDismiss={onDismiss}
          index={i}
        />
      ))}
    </div>
  );
};

export default AlertPanel;
