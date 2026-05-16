import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ label, options = [], error, className = '', ...props }, ref) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="input-label">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={`input-field appearance-none pr-9 ${error ? 'error' : ''}`}
        {...props}
      >
        {options.map(opt =>
          typeof opt === 'string'
            ? <option key={opt} value={opt}>{opt}</option>
            : <option key={opt.value} value={opt.value}>{opt.icon ? `${opt.icon} ${opt.label}` : opt.label}</option>
        )}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <ChevronDown size={16} />
      </span>
    </div>
    {error && <p className="input-error-msg">{error}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;
