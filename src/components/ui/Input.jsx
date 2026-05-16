import { forwardRef, useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  success,
  type = 'text',
  icon: Icon,
  className = '',
  hint,
  ...props
}, ref) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type;

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-wrapper">
        {Icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={16} />
          </span>
        )}
        <input
          ref={ref}
          type={inputType}
          className={`input-field ${Icon ? 'has-icon' : ''} ${error ? 'error' : ''} ${success ? 'success' : ''} ${isPassword ? 'pr-10' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {success && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle size={16} />
          </span>
        )}
        {error && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
            <AlertCircle size={16} />
          </span>
        )}
      </div>
      {error && <p className="input-error-msg">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
