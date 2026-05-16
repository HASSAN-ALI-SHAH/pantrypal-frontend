import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title=" "
    maxWidth="420px"
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
        <Button
          variant={variant}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="flex flex-col items-center text-center gap-3 py-2">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${variant === 'danger' ? 'bg-red-50' : 'bg-amber-50'}`}>
        <AlertTriangle size={28} className={variant === 'danger' ? 'text-red-500' : 'text-amber-500'} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-text-dark">{title}</h3>
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;
